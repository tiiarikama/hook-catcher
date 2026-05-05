import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http";
import { metrics } from "@opentelemetry/api";

export const metricReader = new PeriodicExportingMetricReader({
  exporter: new OTLPMetricExporter({
    url: "https://api.honeycomb.io/v1/metrics",
    headers: {
      "x-honeycomb-team": process.env.HONEYCOMB_API_KEY ?? "",
      "x-honeycomb-dataset": process.env.HONEYCOMB_DATASET ?? "hookcatcher",
    },
  }),
  exportIntervalMillis: 6000,
});

const meter = metrics.getMeter("hookcatcher-backend");

export const webhooksCaptured = meter.createCounter(
  "hookcatcher.webhooks.captured",
  { description: "Number of webhooks captured successfully" },
);
export const binsCreated = meter.createCounter("hookcatcher.bins.created", {
  description: "Number of bins created",
});
export const binsDeleted = meter.createCounter("hookcatcher.bins.deleted", {
  description: "Number of bins deleted",
});
export const binsCleanedUp = meter.createCounter(
  "hookcatcher.bins.cleaned_up",
  { description: "Number of expired bins cleaned up" },
);
export const activeConnections = meter.createUpDownCounter(
  "hookcatcher.ws.active_connections",
  { description: "Number of active websocket connections" },
);
export const webhookCaptureDuration = meter.createHistogram(
  "hookcatcher.webhook.capture.duration_ms",
  {
    description: "Distribution for duration of webhook capture in milliseconds",
    unit: "ms",
  },
);
