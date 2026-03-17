"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBin = createBin;
exports.findBinById = findBinById;
exports.findRequestDocumentsByBinId = findRequestDocumentsByBinId;
exports.findExpiredBins = findExpiredBins;
exports.getAllBins = getAllBins;
exports.deleteBin = deleteBin;
exports.deleteAllRequestDocumentsWithBinId = deleteAllRequestDocumentsWithBinId;
const connection_1 = __importDefault(require("./postgres/connection"));
const connection_2 = __importDefault(require("./mongo_db/connection"));
async function createBin(id) {
    const client = await connection_1.default.connect();
    const queryString = `INSERT INTO bins (id) VALUES ($1) RETURNING id, created_at, expires_at`;
    const result = await client.query(queryString, [id]);
    return result.rows[0];
}
async function findBinById(id) {
    const client = await connection_1.default.connect();
    const queryString = "SELECT * FROM bins WHERE id = ($1)";
    const result = await client.query(queryString, [id]);
    return result.rows[0] ?? null;
}
async function findRequestDocumentsByBinId(id) {
    const client = await connection_2.default.connect();
    const collection = client
        .db(connection_2.default.MONGO_DB_NAME)
        .collection(connection_2.default.MONGO_COLLECTION_NAME);
    const result = await collection.find({ bin_id: id }).toArray();
    return result;
}
async function findExpiredBins() {
    const client = await connection_1.default.connect();
    const queryString = "SELECT * FROM bins WHERE expires_at < NOW()";
    const result = await client.query(queryString);
    return result.rows;
}
async function getAllBins() {
    const client = await connection_1.default.connect();
    const queryString = "SELECT * FROM bins";
    const result = await client.query(queryString);
    return result.rows;
}
async function deleteBin(id) {
    const client = await connection_1.default.connect();
    const queryString = "DELETE FROM bins WHERE id = $1";
    await client.query(queryString, [id]);
}
async function deleteAllRequestDocumentsWithBinId(id) {
    const client = await connection_2.default.connect();
    const collection = client
        .db(connection_2.default.MONGO_DB_NAME)
        .collection(connection_2.default.MONGO_COLLECTION_NAME);
    await collection.deleteMany({ bin_id: id });
}
//# sourceMappingURL=binRepo.js.map