import { trace } from "@opentelemetry/api";
import { nanoid } from "nanoid";
import {
  createBin as repoCreateBin,
  findBinById,
  findRequestDocumentsByBinId,
  getAllBins as repoGetAllBins,
  deleteBin as repoDeleteBin,
  deleteAllRequestDocumentsWithBinId,
  findExpiredBins,
} from "../db_connections/binRepo";
import { Bin, BinResponse, BinWithRequestDocuments } from "../types";

const BIN_ID_LENGTH = 10;

export async function createBin(): Promise<BinResponse> {
  const id = nanoid(BIN_ID_LENGTH);
  const bin: Bin = await repoCreateBin(id);

  const span = trace.getActiveSpan();
  if (span) {
    span.setAttribute("bin.id", bin.id);
  }

  const inspectUrl = `/bins/${bin.id}`;
  const sendUrl = `/${bin.id}`;

  return {
    bin,
    sendUrl,
    inspectUrl,
  };
}

// service layer function for fetching all bins from the PostgreSQL client
export async function getAllBins(): Promise<Bin[]> {
  const result = await repoGetAllBins();

  const span = trace.getActiveSpan();
  if (span) {
    span.setAttribute("bins.count", result.length);
  }

  return result;
}

export async function getBinWithRequestDocuments(
  id: string,
): Promise<BinWithRequestDocuments> {
  const span = trace.getActiveSpan();
  if (span) {
    span.setAttribute("bin.id", id);
  }

  const bin: Bin | null = await findBinById(id);

  if (!bin) {
    throw new Error("Bin not found.");
  }

  if (bin.expires_at < new Date()) {
    throw new Error("Bin has expired.");
  }

  const requests = await findRequestDocumentsByBinId(id);

  if (span) {
    span.setAttribute("bin.request_count", requests.length);
  }

  return {
    bin,
    requests,
  };
}

export async function deleteBin(id: string): Promise<void> {
  const span = trace.getActiveSpan();
  if (span) {
    span.setAttribute("bin.id", id);
  }

  const bin: Bin | null = await findBinById(id);

  if (!bin) {
    throw new Error("Bin not found.");
  }

  await deleteAllRequestDocumentsWithBinId(id);
  await repoDeleteBin(id);
}

export async function cleanupExpiredBins(): Promise<number> {
  const tracer = trace.getTracer("hookcatcher-backend");
  return tracer.startActiveSpan("cleanup.expiredBins", async (span) => {
    const expiredBins = await findExpiredBins();

    for (const bin of expiredBins) {
      await deleteAllRequestDocumentsWithBinId(bin.id);
      await deleteBin(bin.id);
    }

    span.setAttribute("cleanup.bins_removed", expiredBins.length);
    span.end();

    return expiredBins.length;
  });
}
