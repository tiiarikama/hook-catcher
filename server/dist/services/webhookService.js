"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.captureRequest = captureRequest;
const binRepo_1 = require("../db_connections/binRepo");
const webhookRepo_1 = require("../db_connections/webhookRepo");
const connectionManager_1 = __importDefault(require("../websockets/connectionManager"));
async function captureRequest(binId, method, path, headers, body) {
    // 1. Validate bin exists
    const bin = await (0, binRepo_1.findBinById)(binId);
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
    const document = {
        bin_id: binId,
        method,
        path,
        headers,
        body,
        received_at,
    };
    const mongoId = await (0, webhookRepo_1.createRequestDocument)(document);
    // 5. Store metadata + MongoDB pointer in Postgres
    const requestRecord = await (0, webhookRepo_1.createRequestRecord)(binId, mongoId, method, path, received_at);
    //6. Push new incoming requests to client via websocket
    connectionManager_1.default.broadcast(binId, {
        type: "new_request",
        payload: document,
    });
    return requestRecord;
}
//# sourceMappingURL=webhookService.js.map