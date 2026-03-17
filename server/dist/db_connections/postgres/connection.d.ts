import { Client, ClientConfig } from "pg";
/**
 * Connects to a PostgreSQL database using the provided or default configuration.
 * @param config - Optional overrides for the default connection configuration.
 * @returns The connected Client instance.
 */
declare function connect(config?: ClientConfig): Promise<Client>;
/**
 * Disconnects from the PostgreSQL database.
 */
declare function disconnect(): Promise<void>;
declare const _default: {
    connect: typeof connect;
    disconnect: typeof disconnect;
};
export default _default;
//# sourceMappingURL=connection.d.ts.map