CREATE DATABASE doe;

CREATE TABLE donors (
    id SERIAL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    blood TEXT NOT NULL,
    PRIMARY KEY (id)
);