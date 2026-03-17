"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
const connectionManager_1 = __importDefault(require("./websockets/connectionManager"));
const http_1 = __importDefault(require("http"));
const scheduledCleanup_1 = require("./cleanup/scheduledCleanup");
const PORT = process.env.PORT || 3000;
const server = http_1.default.createServer(app_1.default);
connectionManager_1.default.init(server);
const cleanupTimer = (0, scheduledCleanup_1.startScheduledCleanup)();
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
//# sourceMappingURL=index.js.map