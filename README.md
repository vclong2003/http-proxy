# HTTP Proxy

<img width="970" height="708" alt="Screenshot 2026-09-02 at 21 47 15" src="https://github.com/user-attachments/assets/b3488c7a-b2b9-4bcd-8c06-766ed70a5dd1" />
<img width="970" height="708" alt="Screenshot 2026-09-02 at 21 47 26" src="https://github.com/user-attachments/assets/b2be745c-8490-47fc-9f06-712244d9e207" />
<img width="955" height="664" alt="Screenshot 2026-09-02 at 21 49 53" src="https://github.com/user-attachments/assets/7e93da20-9904-445c-bb0d-d14f36de7146" />

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
