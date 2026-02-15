CREATE TABLE IF NOT EXISTS site_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(255) NOT NULL UNIQUE,
    setting_value TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO site_settings (setting_key, setting_value) VALUES 
('registration_open', 'true'),
('recaptcha_site_key', '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'),
('recaptcha_secret_key', '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe')
ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value);
