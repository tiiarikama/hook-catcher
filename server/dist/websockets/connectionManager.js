"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const binClients = new Map();
function init(server) {
    const wsServer = new ws_1.WebSocketServer({ server, path: "/ws" });
    wsServer.on("connection", (websocket, request) => {
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
        binClients.get(binId).add(websocket);
        console.log(`Client connected to bin: ${binId}`);
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
        });
    });
}
function broadcast(binId, request) {
    const websocketConnections = binClients.get(binId);
    if (!websocketConnections)
        return;
    const requestData = JSON.stringify(request);
    websocketConnections.forEach((connection) => {
        if (connection.readyState === ws_1.WebSocket.OPEN) {
            connection.send(requestData);
        }
    });
}
exports.default = { init, broadcast };
//# sourceMappingURL=connectionManager.js.map