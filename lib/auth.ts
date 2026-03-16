const TOKEN_KEY = "wc_access_token"

export interface AuthUser {
  id: number
  name: string
  lastname?: string
  email?: string
  phone: string
  role?: string
  roleId?: number
  isVerified?: boolean
  createdAt?: string
}

export function saveToken(token: string) {
  if (typeof window === "undefined") return
  localStorage.setItem(TOKEN_KEY, token)
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(TOKEN_KEY)
}

export function clearAuth() {
  if (typeof window === "undefined") return
  localStorage.removeItem(TOKEN_KEY)
}

export function isLoggedIn(): boolean {
  return !!getToken()
}
