CREATE TABLE IF NOT EXISTS board_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255),
    image TEXT,
    display_order INT DEFAULT 0
);

INSERT INTO board_members (name, role, image, display_order) VALUES 
('أحمد بن محمد', 'رئيس مجلس الإدارة', '', 1),
('خالد بن عبدالله', 'نائب الرئيس', '', 2),
('محمد بن سعيد', 'أمين الصندوق', '', 3),
('عبدالرحمن بن علي', 'المدير التنفيذي', '', 4);
