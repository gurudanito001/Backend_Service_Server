"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./config"));
const port = config_1.default.SERVER_PORT || 8001;
app_1.default.listen(port, () => {
    console.log(`[server]: Local server running at https://localhost:${port}`);
});
exports.default = app_1.default;
//# sourceMappingURL=server.js.map