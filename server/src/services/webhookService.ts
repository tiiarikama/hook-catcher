import { IncomingHttpHeaders } from "http";
import { trace } from "@opentelemetry/api";
import { findBinById } from "../db_connections/binRepo";
import {
  createRequestDocument,
  createRequestRecord,
} from "../db_connections/webhookRepo";
import { RequestDocument, RequestRecord } from "../types";
import wsManager from "../websockets/connectionManager";
import { webhooksCaptured, webhookCaptureDuration } from "../observability";

export async function captureRequest(
  binId: string,
  method: string,
  path: string,
  headers: IncomingHttpHeaders,
  body: any,
): Promise<RequestRecord> {
  const start = Date.now();

  const span = trace.getActiveSpan();
  if (span) {
    span.setAttributes({
      "bin.id": binId,
      "webhook.method": method,
      "webhook.path": path,
      "webhook.has_body": body !== undefined && body !== null,
      "webhook.headers_count": Object.keys(headers).length,
    });
  }
  // 1. Validate bin exists
  const bin = await findBinById(binId);

  if (!bin) {
    throw new Error("Bin not found.");
  }

  // 2. Check if bin has expired
  if (bin.expires_at < new Date()) {
    throw new Error("Bin has expired.");
  }

  // 3. Capture a single timestamp for consistency across both databases
  const received_at = new Date();

  // 4. Store full payload in MongoDB first
  const document: RequestDocument = {
    bin_id: binId,
    method,
    path,
    headers,
    body,
    received_at,
  };

  const mongoId: string = await createRequestDocument(document);

  // 5. Store metadata + MongoDB pointer in Postgres
  const requestRecord = await createRequestRecord(
    binId,
    mongoId,
    method,
    path,
    received_at,
  );

  if (span) {
    span.setAttributes({
      "request.pg_id": requestRecord.id,
      "request.mongo_id": mongoId,
    });
  }

  //6. Push new incoming requests to client via websocket
  wsManager.broadcast(binId, {
    type: "new_request",
    payload: document,
  });

  webhooksCaptured.add(1, { "bin.id": binId });
  webhookCaptureDuration.record(Date.now() - start, { "bin.id": binId });

  return requestRecord;
}
