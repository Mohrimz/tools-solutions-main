export const AUTH_KEY = "tools-solutions-auth"
export const THEME_KEY = "tools-solutions-theme"

export function getAuthState(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem(AUTH_KEY) === "1"
}

export function setAuthState(authenticated: boolean): void {
  if (typeof window === "undefined") return
  if (authenticated) {
    localStorage.setItem(AUTH_KEY, "1")
  } else {
    localStorage.removeItem(AUTH_KEY)
  }
}

export function getTheme(): "light" | "dark" | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(THEME_KEY) as "light" | "dark" | null
}

export function setTheme(theme: "light" | "dark"): void {
  if (typeof window === "undefined") return
  localStorage.setItem(THEME_KEY, theme)
}
