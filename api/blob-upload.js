const MAX_UPLOAD_BYTES = Number.parseInt(process.env.MAX_UPLOAD_BYTES || "", 10) || 20 * 1024 * 1024;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "*";

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader("Access-Control-Max-Age", "86400");
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => resolve(body));
    req.on("error", (error) => reject(error));
  });
}

module.exports = async (req, res) => {
  setCors(res);

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== "POST") {
    res.statusCode = 405;
    res.end("Method Not Allowed");
    return;
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 500;
    res.end(JSON.stringify({ error: "Missing BLOB_READ_WRITE_TOKEN" }));
    return;
  }

  let handleUpload = null;
  try {
    ({ handleUpload } = require("@vercel/blob/server"));
  } catch (error) {
    try {
      ({ handleUpload } = require("@vercel/blob"));
    } catch (innerError) {
      res.setHeader("Content-Type", "application/json");
      res.statusCode = 500;
      res.end(JSON.stringify({
        error: "Missing @vercel/blob/server. Ensure @vercel/blob is installed.",
        detail: innerError?.message || "Module not found"
      }));
      return;
    }
  }

  try {
    const rawBody = await readBody(req);
    const body = rawBody ? JSON.parse(rawBody) : {};

    const jsonResponse = await handleUpload({
      request: req,
      body,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ["text/plain"],
        maximumSizeInBytes: MAX_UPLOAD_BYTES
      }),
      onUploadCompleted: async () => {
        // No-op
      }
    });

    res.setHeader("Content-Type", "application/json");
    res.statusCode = 200;
    res.end(JSON.stringify(jsonResponse));
  } catch (error) {
    console.error("Blob upload error:", error);
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 500;
    res.end(JSON.stringify({ error: error?.message || "Upload Token Failed" }));
  }
};
