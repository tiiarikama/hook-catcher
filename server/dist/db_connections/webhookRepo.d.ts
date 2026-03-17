import { RequestDocument, RequestRecord } from "../types";
export declare function createRequestRecord(binId: string, mongoId: string, method: string, path: string, received_at: Date): Promise<RequestRecord>;
export declare function createRequestDocument(document: RequestDocument): Promise<string>;
//# sourceMappingURL=webhookRepo.d.ts.map