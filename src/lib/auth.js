// ==========================================
// نظام المصادقة - Authentication
// يتصل بقاعدة البيانات MySQL عبر API
// ==========================================

const API_BASE = '/api';

// ==========================================
// أدوار المستخدمين
// ==========================================

export const USER_ROLES = {
    ADMIN: 'admin',
    EDITOR: 'editor',
    MEMBER: 'member',
    GUEST: 'guest',
};

// Alias للتوافق
export const ROLES = USER_ROLES;

export const ROLE_PERMISSIONS = {
    admin: ['manage_users', 'manage_content', 'manage_settings', 'view_reports', 'manage_gallery'],
    editor: ['manage_content', 'view_reports', 'manage_gallery'],
    member: ['view_content', 'view_reports'],
    guest: ['view_content'],
};

// ==========================================
// التهيئة
// ==========================================

export async function initializeAuth() {
    try {
        // إنشاء حساب أدمن افتراضي إذا لم يوجد
        const res = await fetch(`${API_BASE}/users`);
        const users = res.ok ? await res.json() : [];

        if (users.length === 0) {
            await registerUser({
                email: 'admin@df.org.sa',
                password: 'admin123',
                name: 'مدير النظام',
                role: 'admin',
            });
        }
    } catch (error) {
        console.error('خطأ في تهيئة المصادقة:', error);
    }
}

// ==========================================
// التسجيل
// ==========================================

export async function registerUser({ email, password, name, role, recaptchaToken, isAdmin = false }) {
    try {
        const res = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, name, role, recaptchaToken, isAdmin }),
        });

        const data = await res.json();

        if (!res.ok) {
            return { success: false, error: data.error };
        }

        return { success: true, user: data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ==========================================
// تسجيل الدخول
// ==========================================

export async function loginUser({ email, password }) {
    try {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
            return { success: false, error: data.error };
        }

        // حفظ بيانات المستخدم في localStorage (للجلسة)
        if (typeof window !== 'undefined') {
            localStorage.setItem('dhafar_current_user', JSON.stringify(data));
        }

        return { success: true, user: data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ==========================================
// تسجيل الخروج
// ==========================================

export function logoutUser() {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('dhafar_current_user');
    }
    window.location.href = '/';
}

// ==========================================
// المستخدم الحالي
// ==========================================

export function getCurrentUser() {
    if (typeof window === 'undefined') return null;
    try {
        const data = localStorage.getItem('dhafar_current_user');
        return data ? JSON.parse(data) : null;
    } catch {
        return null;
    }
}

export function isLoggedIn() {
    return getCurrentUser() !== null;
}

export function isAdmin() {
    const user = getCurrentUser();
    return user?.role === 'admin';
}

// ==========================================
// الصلاحيات
// ==========================================

export function hasPermission(permission) {
    const user = getCurrentUser();
    if (!user) return false;
    const perms = ROLE_PERMISSIONS[user.role] || [];
    return perms.includes(permission);
}

export function requireAuth() {
    if (!isLoggedIn()) {
        if (typeof window !== 'undefined') {
            window.location.href = '/login';
        }
        return false;
    }
    return true;
}

export function requireAdmin() {
    if (!isAdmin()) {
        if (typeof window !== 'undefined') {
            window.location.href = '/';
        }
        return false;
    }
    return true;
}

// ==========================================
// جلب المستخدمين (للأدمن)
// ==========================================

export async function getUsers() {
    try {
        const res = await fetch(`${API_BASE}/users`);
        if (!res.ok) throw new Error('فشل في جلب المستخدمين');
        return await res.json();
    } catch (error) {
        console.error('خطأ في جلب المستخدمين:', error);
        return [];
    }
}

export async function updateUserRole(userId, newRole) {
    try {
        const res = await fetch(`${API_BASE}/users/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role: newRole }),
        });
        return res.ok;
    } catch (error) {
        console.error('خطأ في تحديث الصلاحية:', error);
        return false;
    }
}

export async function deleteUser(userId) {
    try {
        const res = await fetch(`${API_BASE}/users/${userId}`, {
            method: 'DELETE',
        });
        return res.ok;
    } catch (error) {
        console.error('خطأ في حذف المستخدم:', error);
        return false;
    }
}

