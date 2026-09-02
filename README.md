# HTTP Proxy

Simple HTTP proxy with ExpressJS and Unblocker

![Web UI](https://github.com/user-attachments/assets/b3488c7a-b2b9-4bcd-8c06-766ed70a5dd1)
![Proxied Web Page](https://github.com/user-attachments/assets/b2be745c-8490-47fc-9f06-712244d9e207)
![Injected CORS Headers](https://github.com/user-attachments/assets/7e93da20-9904-445c-bb0d-d14f36de7146)

## Features

- **SSRF Protection:** Blocks requests targeting private/internal IP ranges.
- **Rate Limiting:** Protects UI and proxy routes from abuse.
- **Size Caps:** Limits request bodies (10MB) and downloads (50MB).
- **CORS:** Add CORS header to the response to by pass browser restriction.
---

## Quick Start

```bash
npm install
node server.js
```
