'use client';

import { useState, useEffect } from 'react';

// إعدادات الموقع العامة (من /api/settings) مع تخزين مؤقت حتى لا تُطلب في كل صفحة
let cache = null;
let pending = null;

export function loadSiteSettings() {
    if (cache) return Promise.resolve(cache);
    if (!pending) {
        pending = fetch('/api/settings')
            .then((res) => (res.ok ? res.json() : {}))
            .catch(() => ({}))
            .then((data) => {
                cache = data || {};
                pending = null;
                return cache;
            });
    }
    return pending;
}

// يُستدعى بعد تغيير إعداد من لوحة التحكم
export function clearSiteSettingsCache() {
    cache = null;
}

export function useSiteSettings() {
    const [settings, setSettings] = useState(cache);
    useEffect(() => {
        let active = true;
        loadSiteSettings().then((s) => {
            if (active) setSettings(s);
        });
        return () => {
            active = false;
        };
    }, []);
    return settings; // null أثناء التحميل
}

export function isGalleryEnabled(settings) {
    return settings?.gallery_enabled === 'true';
}
