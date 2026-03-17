"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRequestRecord = createRequestRecord;
exports.createRequestDocument = createRequestDocument;
const connection_1 = __importDefault(require("./postgres/connection"));
const connection_2 = __importDefault(require("./mongo_db/connection"));
// Inserting request to Postgres DB
async function createRequestRecord(binId, mongoId, method, path, received_at) {
    const client = await connection_1.default.connect();
    const insertQuery = `INSERT INTO requests (bin_id, mongo_id, method, path, received_at) VALUES ($1, $2, $3, $4, $5) RETURNING *;`;
    const result = await client.query(insertQuery, [
        binId,
        mongoId,
        method,
        path,
        received_at,
    ]);
    return result.rows[0];
}
// Inserting request payload to MongoDB
async function createRequestDocument(document) {
    const client = await connection_2.default.connect();
    const collection = client
        .db(connection_2.default.MONGO_DB_NAME)
        .collection(connection_2.default.MONGO_COLLECTION_NAME);
    const result = await collection.insertOne(document);
    return result.insertedId.toHexString();
}
//# sourceMappingURL=webhookRepo.js.map