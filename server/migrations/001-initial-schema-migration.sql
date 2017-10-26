-- Up
CREATE TABLE Configuration (id INTEGER PRIMARY KEY, key TEXT, value TEXT);
INSERT INTO Category (id, name) VALUES (1, 'Device', 'BrightSign');

-- Down
DROP TABLE Category
DROP TABLE Post;