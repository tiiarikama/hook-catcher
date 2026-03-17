"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const binHandler_1 = __importDefault(require("./handlers/binHandler"));
const webhookHandler_1 = __importDefault(require("./handlers/webhookHandler"));
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
// Routes
app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});
// Mount API routes
app.use("/api/bins", binHandler_1.default);
// Mount catch-all webhook route here
app.use("/hooks", webhookHandler_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map