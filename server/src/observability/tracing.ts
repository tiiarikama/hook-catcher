import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";

export const traceExporter = new OTLPTraceExporter({
  url: "https://api.honeycomb.io/v1/traces",
  headers: {
    "x-honeycomb-team": process.env.HONEYCOMB_API_KEY ?? "",
    "x-honeycomb-dataset": process.env.HONEYCOMB_DATASET ?? "hookcatcher",
  },
});

