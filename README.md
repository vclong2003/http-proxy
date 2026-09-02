# HTTP Proxy

A lightweight, Node.js proxy built with Express and Unblocker.

## Features

- **SSRF Protection:** Blocks requests targeting private/internal IP ranges.
- **Rate Limiting:** Protects UI and proxy routes from abuse.
- **Size Caps:** Limits request bodies (10MB) and downloads (50MB).
- **CORS: ** Add CORS header to the response to by pass browser restriction.
---

## Quick Start

```bash
npm install
node server.js
```
