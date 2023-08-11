CREATE DATABASE workers;

CREATE TABLE corp_data(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    job_title VARCHAR(255), 
    date_of_hire DATE NOT NULL,
    salary VARCHAR(50),
    e_mail VARCHAR(75)
);
