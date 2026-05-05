import { trace } from "@opentelemetry/api";
import { WebSocketServer, WebSocket } from "ws";
import { IncomingMessage, Server } from "http";
import { BroadcastRequest } from "../types";

const tracer = trace.getTracer("hookcatcher-backend");
const binClients = new Map<string, Set<WebSocket>>();

function init(server: Server): void {
  const wsServer = new WebSocketServer({ server, path: "/ws" });

  wsServer.on(
    "connection",
    (websocket: WebSocket, request: IncomingMessage) => {
      // E.g. If the client connects to ws://localhost:3000/ws?binId=a3Bx9k
      const url = new URL(request.url || "", `http://${request.headers.host}`);
      const binId = url.searchParams.get("binId");

      if (!binId) {
        websocket.close(1008, "Invalid path. Missing binId query parameter.");
        return;
      }

      // Add websocket connecion object to the binClients map
      if (!binClients.has(binId)) {
        binClients.set(binId, new Set());
      }
      binClients.get(binId)!.add(websocket);

      console.log(`Client connected to bin: ${binId}`);

      tracer.startActiveSpan("ws.client_connected", (span) => {
        span.setAttributes({
          "bin.id": binId,
          "ws.clients_count": binClients.get(binId)!.size,
        });

        span.end();
      });

      // cleanup on disconnect: removes websocket connection from a specific bin, and removes the bin if no connects remain
      websocket.on("close", () => {
        const websocketConnections = binClients.get(binId);

        if (websocketConnections) {
          websocketConnections.delete(websocket);

          if (websocketConnections.size === 0) {
            binClients.delete(binId);
          }
        }
        console.log(`Client disconnected from bin: ${binId}`);

        tracer.startActiveSpan("ws.client_disconnected", (span) => {
          span.setAttributes({
            "bin.id": binId,
            "ws.clients_count": binClients.get(binId)?.size ?? 0,
          });

          span.end();
        });
      });
    },
  );
}

function broadcast(binId: string, request: BroadcastRequest): void {
  const websocketConnections = binClients.get(binId);

  if (!websocketConnections) return;

  const span = trace.getActiveSpan();
  if (span) {
    span.setAttributes({
      "bin.id": binId,
      "ws.clients_count": websocketConnections.size,
    });
  }

  const requestData = JSON.stringify(request);

  websocketConnections.forEach((connection) => {
    if (connection.readyState === WebSocket.OPEN) {
      connection.send(requestData);
    }
  });
}

export default { init, broadcast };
