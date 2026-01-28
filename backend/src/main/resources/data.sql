INSERT INTO app_users (username, password, role, full_name, email) VALUES 
('kumar', 'demo', 'CITIZEN', 'Kumar Citizen', 'kumar@example.com'),
('ram', 'worker', 'OFFICER', 'Ram Worker', 'ram@city.gov'),
('manager', 'admin', 'ADMIN', 'Manager Supervisor', 'manager@city.gov');

INSERT INTO complaint (title, description, status, category, citizen_id, upvotes, latitude, longitude, created_at) VALUES 
('Deep Pothole on Main St', 'A very deep pothole causing traffic slowdowns near the market junction.', 'PENDING', 'Roads', 1, 5, 13.0835, 80.2715, CURRENT_TIMESTAMP()),
('Garbage Overflow in Park', 'Trash bins are overflowing and garbage is scattered all over the children play area.', 'PENDING', 'Sanitation', 1, 12, 13.0810, 80.2740, CURRENT_TIMESTAMP()),
('Streetlight Not Working', 'Streetlight #45 is flickering and completely dark at night.', 'ASSIGNED', 'Utilities', 1, 3, 13.0850, 80.2690, CURRENT_TIMESTAMP()),
('Water Leakage', 'Clean water is leaking from the main pipeline.', 'RESOLVED', 'Utilities', 1, 8, 13.0805, 80.2725, CURRENT_TIMESTAMP());

-- Assign the 3rd complaint to Ram
UPDATE complaint SET officer_id = 2 WHERE id = 3;
