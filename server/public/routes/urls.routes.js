"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const open_graph_scraper_1 = __importDefault(require("open-graph-scraper"));
const router = express_1.default.Router();
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { url1, url2, url3 } = req.body;
    const urls = [url1, url2, url3];
    if (!Array.isArray(urls) || urls.length === 0) {
        return res
            .status(400)
            .json({ error: "Invalid input, must be an array of URLs." });
    }
    const results = yield Promise.all(urls.map((url) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const options = { url };
            const response = yield (0, open_graph_scraper_1.default)(options);
            if (response.result.success) {
                const result = response.result;
                let images = [];
                if (Array.isArray(result.ogImage)) {
                    images = result.ogImage.map((imgObj) => imgObj.url || "");
                }
                else if (result.ogImage) {
                    images.push(result.ogImage);
                }
                return {
                    title: result.ogTitle || "",
                    description: result.ogDescription || "",
                    image: images,
                    url,
                };
            }
            else {
                return {
                    title: "",
                    description: "",
                    image: [],
                    url,
                    error: response.error || "Unknown error",
                };
            }
        }
        catch (e) {
            return {
                title: "",
                description: "",
                image: [],
                url,
                error: e.message,
            };
        }
    })));
    console.log(JSON.stringify(results, null, 2));
    return res.json(results);
}));
exports.default = router;
