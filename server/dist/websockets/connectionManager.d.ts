import { Server } from "http";
import { BroadcastRequest } from "../types";
declare function init(server: Server): void;
declare function broadcast(binId: string, request: BroadcastRequest): void;
declare const _default: {
    init: typeof init;
    broadcast: typeof broadcast;
};
export default _default;
//# sourceMappingURL=connectionManager.d.ts.map