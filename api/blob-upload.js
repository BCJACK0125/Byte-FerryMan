const MAX_UPLOAD_BYTES = Number.parseInt(process.env.MAX_UPLOAD_BYTES || "", 10) || 20 * 1024 * 1024;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "*";

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "content-type, x-vercel-blob-action, x-vercel-blob-allowed-content-types, x-vercel-blob-maximum-size, x-vercel-blob-token"
  );
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

function buildRequest(req, rawBody) {
  const protocol = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers["x-forwarded-host"] || req.headers.host || "localhost";
  const url = `${protocol}://${host}${req.url || ""}`;
  const headers = new Headers();

  for (const [key, value] of Object.entries(req.headers || {})) {
    if (Array.isArray(value)) {
      headers.set(key, value.join(","));
    } else if (value !== undefined) {
      headers.set(key, String(value));
    }
  }

  return new Request(url, {
    method: req.method || "POST",
    headers,
    body: rawBody || null
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
    const blobServer = await import("@vercel/blob/server");
    handleUpload =
      blobServer.handleUpload ||
      blobServer.default?.handleUpload ||
      blobServer.default ||
      null;
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 500;
    res.end(JSON.stringify({
      error: "Failed to load @vercel/blob/server",
      detail: error?.message || "Module import failed"
    }));
    return;
  }

  if (typeof handleUpload !== "function") {
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 500;
    res.end(JSON.stringify({ error: "handleUpload is not a function" }));
    return;
  }

  try {
    const rawBody = await readBody(req);
    const body = rawBody ? JSON.parse(rawBody) : {};
    const request = buildRequest(req, rawBody);

    console.log("Blob upload request:", {
      type: body?.type || "(missing)",
      hasPayload: Boolean(body?.payload),
      pathname: body?.payload?.pathname || "(missing)"
    });

    const jsonResponse = await handleUpload({
      request,
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
    console.error("Blob upload error:", error?.message || error, error?.stack || "");
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 500;
    res.end(JSON.stringify({ error: error?.message || "Upload Token Failed" }));
  }
};
