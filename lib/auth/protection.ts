export function isProtectedNotesPath(pathname: string): boolean {
  return pathname === "/notes" || pathname.startsWith("/notes/");
}

export function getNotesAccessDecision(
  pathname: string,
  hasSessionCookie: boolean,
): "continue" | "redirect-to-login" {
  if (!isProtectedNotesPath(pathname) || hasSessionCookie) {
    return "continue";
  }

  return "redirect-to-login";
}
