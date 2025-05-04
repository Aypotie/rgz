CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    surname VARCHAR(50) NOT NULL,
    name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone VARCHAR(11) NOT NULL,
    password VARCHAR(60) NOT NULL
);

CREATE TABLE IF NOT EXISTS sector (
    id SERIAL PRIMARY KEY,
    name VARCHAR(2) NOT NULL,
    number_seats INT NOT NULL
);

CREATE TABLE IF NOT EXISTS type_incident (
	id SERIAL PRIMARY KEY,
	name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS status (
	id SERIAL PRIMARY KEY,
	name VARCHAR(30) NOT NULL
);

CREATE TABLE IF NOT EXISTS incident (
	id SERIAL PRIMARY KEY,
	created_at TIMESTAMPTZ DEFAULT now(),
	incident_time TIMESTAMPTZ NOT NULL,
	description TEXT NOT NULL,
	status_id INT NOT NULL REFERENCES status(id),
	securityman_id INT NOT NULL REFERENCES users(id),
	type_incident_id INT NOT NULL REFERENCES type_incident(id),
	sector_id INT NOT NULL REFERENCES sector(id)
);