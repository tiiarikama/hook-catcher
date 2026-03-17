import { Bin, BinResponse, BinWithRequestDocuments } from "../types";
export declare function createBin(): Promise<BinResponse>;
export declare function getAllBins(): Promise<Bin[]>;
export declare function getBinWithRequestDocuments(id: string): Promise<BinWithRequestDocuments>;
export declare function deleteBin(id: string): Promise<void>;
export declare function cleanupExpiredBins(): Promise<number>;
//# sourceMappingURL=binService.d.ts.map