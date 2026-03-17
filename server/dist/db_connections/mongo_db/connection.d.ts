import { MongoClient, MongoClientOptions } from "mongodb";
/**
 * Connects to a MongoDB database using the provided or default configuration.
 * @param uri - Optional override for the MongoDB connection URI.
 * @param options - Optional overrides for the default client options.
 * @returns The connected MongoClient instance.
 */
declare function connect(uri?: string, options?: MongoClientOptions): Promise<MongoClient>;
/**
 * Disconnects from the MongoDB database.
 */
declare function disconnect(): Promise<void>;
declare const _default: {
    connect: typeof connect;
    disconnect: typeof disconnect;
    MONGO_COLLECTION_NAME: string;
    MONGO_DB_NAME: string;
};
export default _default;
//# sourceMappingURL=connection.d.ts.map