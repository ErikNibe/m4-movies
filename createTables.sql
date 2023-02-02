CREATE TABLE IF NOT EXISTS movies_info(
	id BIGSERIAL PRIMARY KEY,
	name VARCHAR(50) UNIQUE NOT NULL,
	description TEXT,
	duration BIGINT NOT NULL,
	price BIGINT NOT NULL
);

SELECT 
	*
FROM 
	movies_info;

INSERT INTO	
	movies_info(name, description, duration, price)
VALUES
	('Harry Potter', 'Menino bruxo', 120, 20000.00);

SELECT
	name
FROM 
    movies_info
WHERE
    name = $1