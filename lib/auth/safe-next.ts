// Where to go after signing in, from the ?next= in the URL. Anyone can write that URL, so only a path
// on Lattely is allowed: "/submit" yes; "//evil.com", "/\evil.com" or "https://evil.com" would leave the site.
export function safeNext(next: string | null | undefined) {
  return next && /^\/(?![/\\])/.test(next) ? next : "/";
}
