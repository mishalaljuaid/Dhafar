// Authentication and User Management
// Uses localStorage for local development - can be replaced with real database

const USERS_KEY = 'dhafar_users';
const CURRENT_USER_KEY = 'dhafar_user';

// User roles
export const ROLES = {
    ADMIN: 'admin',
    EDITOR: 'editor',
    MEMBER: 'member',
    GUEST: 'guest',
};

// Role permissions
export const PERMISSIONS = {
    [ROLES.ADMIN]: ['manage_users', 'manage_content', 'view_reports', 'upload_reports', 'manage_gallery', 'manage_news'],
    [ROLES.EDITOR]: ['manage_content', 'view_reports', 'upload_reports', 'manage_gallery', 'manage_news'],
    [ROLES.MEMBER]: ['view_content', 'view_reports'],
    [ROLES.GUEST]: ['view_public'],
};

// Initialize default admin if none exists
export function initializeAuth() {
    if (typeof window === 'undefined') return;

    const users = getUsers();
    if (users.length === 0) {
        // Create default admin
        const defaultAdmin = {
            id: '1',
            email: 'admin@dhafar-fund.org',
            password: 'admin123', // In production, this should be hashed
            name: 'مدير النظام',
            role: ROLES.ADMIN,
            createdAt: new Date().toISOString(),
        };
        saveUser(defaultAdmin);
    }
}

// Get all users
export function getUsers() {
    if (typeof window === 'undefined') return [];
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
}

// Save user
export function saveUser(user) {
    if (typeof window === 'undefined') return;
    const users = getUsers();
    const existingIndex = users.findIndex(u => u.id === user.id);

    if (existingIndex >= 0) {
        users[existingIndex] = user;
    } else {
        users.push(user);
    }

    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Register new user
export function registerUser({ email, password, name }) {
    const users = getUsers();

    // Check if email already exists
    if (users.find(u => u.email === email)) {
        throw new Error('البريد الإلكتروني مسجل مسبقاً');
    }

    const newUser = {
        id: Date.now().toString(),
        email,
        password, // In production, hash this
        name,
        role: ROLES.MEMBER,
        createdAt: new Date().toISOString(),
    };

    saveUser(newUser);
    return { ...newUser, password: undefined };
}

// Login user
export function loginUser({ email, password }) {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    }

    // Store current user (without password)
    const userWithoutPassword = { ...user, password: undefined };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));

    return userWithoutPassword;
}

// Logout user
export function logoutUser() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(CURRENT_USER_KEY);
}

// Get current user
export function getCurrentUser() {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
}

// Check if user has permission
export function hasPermission(user, permission) {
    if (!user) return false;
    const rolePermissions = PERMISSIONS[user.role] || [];
    return rolePermissions.includes(permission);
}

// Update user role (admin only)
export function updateUserRole(userId, newRole) {
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex < 0) {
        throw new Error('المستخدم غير موجود');
    }

    users[userIndex].role = newRole;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return users[userIndex];
}

// Delete user (admin only)
export function deleteUser(userId) {
    const users = getUsers();
    const filtered = users.filter(u => u.id !== userId);
    localStorage.setItem(USERS_KEY, JSON.stringify(filtered));
}
