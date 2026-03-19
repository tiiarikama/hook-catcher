import { loadConfig } from "./config"
import app from "./app";
import wsManager from "./websockets/connectionManager";
import http from "http";
import { startScheduledCleanup } from "./cleanup/scheduledCleanup";

async function main() {
  await loadConfig();

  const PORT = process.env.PORT || 3000;
  const server = http.createServer(app);
  wsManager.init(server);
  const cleanupTimer = startScheduledCleanup();
  
  server.listen(PORT, () => {
    console.log(`HookCatcher server listening on port ${PORT}`);
  });

  process.on("SIGTERM", () => {
    clearInterval(cleanupTimer);
    server.close(() => {
      console.log("Server shut down gracefully.");
      process.exit(0);
    });
  });
}

main().catch(console.error);
