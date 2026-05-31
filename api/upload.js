const { put } = require("@vercel/blob");

const MAX_UPLOAD_BYTES = Number.parseInt(process.env.MAX_UPLOAD_BYTES || "", 10) || 12 * 1024 * 1024;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "*";

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader("Access-Control-Max-Age", "86400");
}

function looksLikeCiphertext(textValue) {
  if (!textValue) {
    return false;
  }
  return textValue.startsWith("U2FsdGVkX1");
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

  let size = 0;
  let aborted = false;
  const chunks = [];

  req.on("data", (chunk) => {
    if (aborted) {
      return;
    }

    size += chunk.length;
    if (size > MAX_UPLOAD_BYTES) {
      aborted = true;
      res.statusCode = 413;
      res.end("Payload Too Large");
      req.destroy();
      return;
    }

    chunks.push(chunk);
  });

  req.on("end", async () => {
    if (aborted) {
      return;
    }

    try {
      const body = Buffer.concat(chunks).toString("utf8").trim();
      if (!body) {
        res.statusCode = 400;
        res.end("Empty Body");
        return;
      }

      if (!looksLikeCiphertext(body)) {
        res.statusCode = 422;
        res.end("Invalid Ciphertext");
        return;
      }

      const name = `ferry-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.enc`;
      const result = await put(name, body, {
        access: "public",
        contentType: "text/plain; charset=utf-8"
      });

      res.setHeader("Content-Type", "application/json");
      res.statusCode = 200;
      res.end(JSON.stringify({ url: result.url }));
    } catch (error) {
      res.statusCode = 500;
      res.end("Upload Failed");
    }
  });

  req.on("error", () => {
    if (!aborted) {
      res.statusCode = 500;
      res.end("Request Error");
    }
  });
};
