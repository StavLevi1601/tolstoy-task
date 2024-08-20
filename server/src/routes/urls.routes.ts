import express, { Request, Response } from "express";
import ogs from "open-graph-scraper";

const router = express.Router();

interface UrlRequest {
  url1: string;
  url2: string;
  url3: string;
}

interface Metadata {
  title: string;
  description: string;
  image: string[];
  url: string;
  error?: string | true;
}

router.post("/", async (req: Request<{}, {}, UrlRequest>, res: Response) => {
  const { url1, url2, url3 } = req.body;
  const urls = [url1, url2, url3];

  if (!Array.isArray(urls) || urls.length === 0) {
    return res
      .status(400)
      .json({ error: "Invalid input, must be an array of URLs." });
  }

  const results: Metadata[] = await Promise.all(
    urls.map(async (url) => {
      try {
        const options = { url };
        const response = await ogs(options);

        if (response.result.success) {
          const result = response.result;
          let images: string[] = [];

          if (Array.isArray(result.ogImage)) {
            images = result.ogImage.map((imgObj: any) => imgObj.url || "");
          } else if (result.ogImage) {
            images.push(result.ogImage);
          }

          return {
            title: result.ogTitle || "",
            description: result.ogDescription || "",
            image: images,
            url,
          };
        } else {
          return {
            title: "",
            description: "",
            image: [],
            url,
            error: response.error || "Unknown error",
          };
        }
      } catch (e) {
        return {
          title: "",
          description: "",
          image: [],
          url,
          error: (e as Error).message,
        };
      }
    })
  );

  console.log(JSON.stringify(results, null, 2));

  return res.json(results);
});

export default router;
