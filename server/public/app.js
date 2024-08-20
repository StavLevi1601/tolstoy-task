"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const urls_routes_1 = __importDefault(require("./routes/urls.routes"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
const app = (0, express_1.default)();
const port = 3000;
app.get("/", (req, res) => {
    res.send("Working");
});
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 1000,
    max: 5,
});
app.use(express_1.default.json());
app.use(limiter);
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use("/url", urls_routes_1.default);
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
