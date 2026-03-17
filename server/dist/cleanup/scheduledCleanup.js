"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startScheduledCleanup = startScheduledCleanup;
const binService_1 = require("../services/binService");
const ONE_HOUR_INTERVAL = 60 * 60 * 1000;
function startScheduledCleanup() {
    const cleanup = () => {
        (0, binService_1.cleanupExpiredBins)()
            .then((count) => {
            if (count > 0) {
                console.log(`Cleaned up ${count} expired bins.`);
            }
        })
            .catch((error) => {
            console.error("Cleanup error:", error);
        });
    };
    cleanup();
    return setInterval(cleanup, ONE_HOUR_INTERVAL);
}
//# sourceMappingURL=scheduledCleanup.js.map