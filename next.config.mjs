/**
 * Nagłówki bezpieczeństwa dla każdego środowiska (Vercel, Docker, `next start`) — SCAM-02.
 *
 * CSP bez nonce: Next.js wstrzykuje inline'owe skrypty hydratacji, więc `script-src`
 * dopuszcza 'unsafe-inline'. Polityka nadal blokuje skrypty z obcych domen, osadzanie
 * strony w ramkach, wtyczki (`object-src`), podmianę `<base>`, wysyłanie formularzy i
 * połączenia (`connect-src`) poza własną domenę. 'unsafe-eval' tylko w trybie dev (HMR).
 */
const isDev = process.env.NODE_ENV !== "production";

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "no-referrer" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  ...(isDev ? [] : [{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" }]),
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Samodzielny serwer dla obrazu Dockera (SCAM-01); Vercel ignoruje to ustawienie.
  output: "standalone",
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
