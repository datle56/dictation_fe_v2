/**
 * Utility functions để quản lý token trong localStorage
 */

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';
const USER_ID_KEY = 'user_id';

export interface StoredUser {
  id: number;
  email: string | null;
  full_name: string;
  learning_language_id: number;
  user_type: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: StoredUser;
  token: string;
}

/**
 * Lưu token và thông tin user vào localStorage
 */
export function saveAuthData(authData: AuthResponse): void {
  localStorage.setItem(TOKEN_KEY, authData.token);
  localStorage.setItem(USER_KEY, JSON.stringify(authData.user));
  localStorage.setItem(USER_ID_KEY, authData.user.id.toString());
}

/**
 * Lấy token từ localStorage
 */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Lấy thông tin user từ localStorage
 */
export function getStoredUser(): StoredUser | null {
  const userData = localStorage.getItem(USER_KEY);
  if (!userData) return null;
  
  try {
    return JSON.parse(userData);
  } catch (error) {
    console.error('Error parsing stored user data:', error);
    return null;
  }
}

/**
 * Xóa token và thông tin user khỏi localStorage
 */
export function clearAuthData(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(USER_ID_KEY);
}

/**
 * Lấy user ID từ localStorage
 */
export function getUserId(): number | null {
  const userId = localStorage.getItem(USER_ID_KEY);
  if (!userId) return null;
  
  const parsedId = parseInt(userId, 10);
  return isNaN(parsedId) ? null : parsedId;
}

/**
 * Kiểm tra xem có token trong localStorage không
 */
export function hasToken(): boolean {
  return getToken() !== null;
}
