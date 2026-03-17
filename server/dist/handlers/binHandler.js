"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const binService_1 = require("../services/binService");
const router = (0, express_1.Router)();
/**
 * POST /api/bins - Creates a new bin.
 * Calls the bin service to generate a unique bin ID, persist it to the database,
 * and return the bin details along with its send and inspect URLs.
 * @returns 201 - The created bin with sendUrl and inspectUrl.
 * @returns 500 - If bin creation fails.
 */
router.post("/", async (_req, res) => {
    try {
        const binResponse = await (0, binService_1.createBin)();
        res.status(201).json(binResponse);
    }
    catch (error) {
        console.error("Failed to create bin.", error);
        res.status(500).json({ error: "Failed to create bin." });
    }
});
exports.default = router;
router.get("/", async (_req, res) => {
    try {
        const bins = await (0, binService_1.getAllBins)();
        res.status(200).json(bins);
    }
    catch (error) {
        console.log("Failed to fetch bins.", error);
        res.status(500).json({ error: "Failed to create bin." });
    }
});
router.get("/:binId", async (req, res) => {
    try {
        const id = req.params.binId;
        const binWithRequestDocuments = await (0, binService_1.getBinWithRequestDocuments)(id);
        res.status(200).json(binWithRequestDocuments);
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message === "Bin not found.") {
                res.status(404).json({ error: "Bin not found." });
                return;
            }
            if (error.message === "Bin has expired.") {
                res.status(410).json({ error: "Bin has expired." });
                return;
            }
        }
        console.log("Failed to fetch bin.");
        res.status(500).json({ error: "Failed to fetch bin." });
    }
});
router.delete("/:binId", async (req, res) => {
    try {
        const id = req.params.binId;
        await (0, binService_1.deleteBin)(id);
        res.status(204).send();
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message === "Bin not found.") {
                res.status(404).json({ error: "Bin not found." });
                return;
            }
        }
        console.log("Failed to delete bin.", error);
        res.status(500).json({ error: "Failed to delete bin." });
    }
});
//# sourceMappingURL=binHandler.js.map