// حد بسيط لعدد المحاولات (في الذاكرة) لمنع تخمين كلمات المرور
const attempts = new Map();

export function getClientIp(request) {
    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) return forwarded.split(',')[0].trim();
    return request.headers.get('x-real-ip') || 'unknown';
}

// يعيد عدد الثواني المتبقية إذا كان المفتاح محظوراً، أو 0
export function isLimited(key, maxAttempts = 5, windowMs = 15 * 60 * 1000) {
    const entry = attempts.get(key);
    if (!entry) return 0;
    if (Date.now() - entry.first > windowMs) {
        attempts.delete(key);
        return 0;
    }
    if (entry.count >= maxAttempts) {
        return Math.ceil((entry.first + windowMs - Date.now()) / 1000);
    }
    return 0;
}

export function recordFailure(key) {
    const entry = attempts.get(key);
    if (!entry) attempts.set(key, { count: 1, first: Date.now() });
    else entry.count += 1;
}

export function clearAttempts(key) {
    attempts.delete(key);
}
