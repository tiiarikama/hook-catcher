"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
// Default connection configuration
const defaultConfig = {
    host: process.env.DB_HOST ?? "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME ?? "hookcatcher",
    user: process.env.DB_USER ?? "postgres",
    password: process.env.DB_PASSWORD ?? "",
    connectionTimeoutMillis: 5000,
    ssl: false, // todo: fix ssl settings for deployed app
};
let client = null;
/**
 * Connects to a PostgreSQL database using the provided or default configuration.
 * @param config - Optional overrides for the default connection configuration.
 * @returns The connected Client instance.
 */
async function connect(config = {}) {
    if (client) {
        console.warn("Already connected to the PostgreSQL database.");
        return client;
    }
    client = new pg_1.Client({ ...defaultConfig, ...config });
    try {
        await client.connect();
        console.log("Successfully connected to the database.");
        return client;
    }
    catch (error) {
        client = null;
        console.error("Failed to connect to the database:", error);
        throw error;
    }
}
/**
 * Disconnects from the PostgreSQL database.
 */
async function disconnect() {
    if (!client) {
        console.warn("No active database connection to disconnect.");
        return;
    }
    try {
        await client.end();
        console.log("Successfully disconnected from the database.");
    }
    catch (error) {
        console.error("Failed to disconnect from the database:", error);
        throw error;
    }
    finally {
        client = null;
    }
}
exports.default = { connect, disconnect };
//# sourceMappingURL=connection.js.map