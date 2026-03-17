"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const webhookService_1 = require("../services/webhookService");
const router = (0, express_1.Router)();
router.all("/:binId", async (req, res) => {
    try {
        const binId = req.params.binId;
        const method = req.method;
        const path = req.path;
        const headers = req.headers;
        const body = req.body;
        const capturedRequest = await (0, webhookService_1.captureRequest)(binId, method, path, headers, body);
        res.status(200).json({ message: "Request captured", request: capturedRequest });
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message === "Bin not found") {
                res.status(404).json({ error: "Bin not found." });
                return;
            }
            if (error.message === "Bin has expired") {
                res.status(410).json({ error: "Bin has expired." });
                return;
            }
        }
        console.error("Failed to capture request:", error);
        res.status(500).json({ error: "Failed to capture request." });
    }
});
exports.default = router;
//# sourceMappingURL=webhookHandler.js.map