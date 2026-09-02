const express = require("express");
const Unblocker = require("unblocker");
const path = require("path");
const dns = require("dns").promises;
const ipaddr = require("ipaddr.js");
const rateLimit = require("express-rate-limit");

const app = express();

app.set("trust proxy", 1);

const sendRateLimitPage = (req, res) => {
  res.status(429).sendFile(path.join(__dirname, "429.html"));
};

const proxyLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 80,
  standardHeaders: true,
  legacyHeaders: false,
  handler: sendRateLimitPage
});

const uiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: sendRateLimitPage
});

const MAX_REQUEST_SIZE = 10 * 1024 * 1024; // 10 MB limit for incoming request bodies
const MAX_RESPONSE_SIZE = 50 * 1024 * 1024; // 50 MB limit for proxied file downloads

const unblocker = new Unblocker({
  prefix: "/proxy/",
  requestMiddleware: [
    (data) => {
      data.headers["user-agent"] =
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";
      data.headers["accept-language"] = "en-US,en;q=0.9,vi;q=0.8";
    }
  ],
  responseMiddleware: [
    (data) => {
      const contentLength = data.headers["content-length"];
      if (contentLength && parseInt(contentLength, 10) > MAX_RESPONSE_SIZE) {
        data.contentType = "text/plain";
        data.status = 413;
        data.stream.destroy();
      }
    }
  ]
});

function isPrivateIp(ipString) {
  try {
    const addr = ipaddr.parse(ipString);
    const range = addr.range();
    const blockedRanges = [
      "uniqueLocal",
      "loopback",
      "private",
      "carrierGradeNat",
      "unspecified"
    ];
    return blockedRanges.includes(range);
  } catch (err) {
    return true;
  }
}

// Check incoming request payload size
const checkRequestSize = (req, res, next) => {
  const contentLength = req.headers["content-length"];
  if (contentLength && parseInt(contentLength, 10) > MAX_REQUEST_SIZE) {
    return res
      .status(413)
      .send("Payload Too Large: Request body exceeds 10 MB limit.");
  }
  next();
};

// Enable CORS for API proxy calls
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Proxy Route Middleware Chain
app.use(
  /^\/proxy\/(.+)$/,
  proxyLimiter,
  checkRequestSize,
  async (req, res, next) => {
    try {
      const rawTarget = req.params[0];
      if (!rawTarget)
        return res.status(400).send("Bad Request: Missing Target URL");

      const targetUrl = rawTarget.startsWith("http")
        ? rawTarget
        : `https://${rawTarget}`;
      const parsedUrl = new URL(targetUrl);
      const hostname = parsedUrl.hostname;

      const addresses = await dns.lookup(hostname, { all: true });

      for (const record of addresses) {
        if (isPrivateIp(record.address)) {
          console.warn(
            `[SSRF Blocked] Access denied to internal IP (${record.address}) via ${hostname}`
          );
          return res
            .status(403)
            .send("Forbidden: Access to internal networks is blocked.");
        }
      }

      next();
    } catch (err) {
      return res.status(400).send("Invalid or unresolvable target URL.");
    }
  }
);

app.use(unblocker);

app.get("/", uiLimiter, (req, res) => {
  if (req.query.__cf_chl_rt_tk || req.query.__cf_chl_f_tk) {
    return res.redirect("/");
  }
  res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = 4000;
app
  .listen(PORT, () =>
    console.log(`[DEBUG] Web Proxy running on http://localhost:${PORT}`)
  )
  .on("upgrade", unblocker.onUpgrade);
