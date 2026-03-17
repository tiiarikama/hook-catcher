import { IncomingHttpHeaders } from "http";
export interface Bin {
    id: string;
    created_at: Date;
    expires_at: Date;
}
export interface BinResponse {
    bin: Bin;
    sendUrl: string;
    inspectUrl: string;
}
export interface RequestRecord {
    id: number;
    bin_id: string;
    mongo_id: string;
    method: string;
    path: string;
    received_at: Date;
}
export interface RequestDocument {
    method: string;
    path: string;
    headers: IncomingHttpHeaders;
    body: Record<string, any>;
    bin_id: string;
    received_at: Date;
}
export interface BinWithRequestDocuments {
    bin: Bin;
    requests: RequestDocument[];
}
export interface BroadcastRequest {
    type: string;
    payload: RequestDocument;
}
//# sourceMappingURL=types.d.ts.map