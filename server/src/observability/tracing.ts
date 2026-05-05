import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";

const honeycombApiKey = process.env.HONEYCOMB_API_KEY;
if (!honeycombApiKey) throw new Error("HONEYCOMB_API_KEY is not defined");

export const traceExporter = new OTLPTraceExporter({
  url: "https://api.honeycomb.io/v1/traces",
  headers: {
    "x-honeycomb-team": honeycombApiKey,
    "x-honeycomb-dataset": process.env.HONEYCOMB_DATASET ?? "hookcatcher",
  },
});
