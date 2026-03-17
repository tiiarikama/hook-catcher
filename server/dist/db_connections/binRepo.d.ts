import { Bin, RequestDocument } from "../types";
export declare function createBin(id: string): Promise<Bin>;
export declare function findBinById(id: string): Promise<Bin | null>;
export declare function findRequestDocumentsByBinId(id: string): Promise<RequestDocument[]>;
export declare function findExpiredBins(): Promise<Bin[]>;
export declare function getAllBins(): Promise<Bin[]>;
export declare function deleteBin(id: string): Promise<void>;
export declare function deleteAllRequestDocumentsWithBinId(id: string): Promise<void>;
//# sourceMappingURL=binRepo.d.ts.map