"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBin = createBin;
exports.getAllBins = getAllBins;
exports.getBinWithRequestDocuments = getBinWithRequestDocuments;
exports.deleteBin = deleteBin;
exports.cleanupExpiredBins = cleanupExpiredBins;
const nanoid_1 = require("nanoid");
const binRepo_1 = require("../db_connections/binRepo");
const BIN_ID_LENGTH = 10;
async function createBin() {
    const id = (0, nanoid_1.nanoid)(BIN_ID_LENGTH);
    const bin = await (0, binRepo_1.createBin)(id);
    const inspectUrl = `/bins/${bin.id}`;
    const sendUrl = `/${bin.id}`;
    return {
        bin,
        sendUrl,
        inspectUrl,
    };
}
// service layer function for fetching all bins from the PostgreSQL client
async function getAllBins() {
    const result = await (0, binRepo_1.getAllBins)();
    return result;
}
async function getBinWithRequestDocuments(id) {
    const bin = await (0, binRepo_1.findBinById)(id);
    if (!bin) {
        throw new Error("Bin not found.");
    }
    if (bin.expires_at < new Date()) {
        throw new Error("Bin has expired.");
    }
    const requests = await (0, binRepo_1.findRequestDocumentsByBinId)(id);
    return {
        bin,
        requests,
    };
}
async function deleteBin(id) {
    const bin = await (0, binRepo_1.findBinById)(id);
    if (!bin) {
        throw new Error("Bin not found.");
    }
    await (0, binRepo_1.deleteAllRequestDocumentsWithBinId)(id);
    await (0, binRepo_1.deleteBin)(id);
}
async function cleanupExpiredBins() {
    const expiredBins = await (0, binRepo_1.findExpiredBins)();
    for (const bin of expiredBins) {
        await (0, binRepo_1.deleteAllRequestDocumentsWithBinId)(bin.id);
        await deleteBin(bin.id);
    }
    return expiredBins.length;
}
//# sourceMappingURL=binService.js.map