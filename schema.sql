-- =========================================================
-- schema.sql — NOT USED BY THIS SITE
-- =========================================================
-- This project is explicitly a FRONTEND-ONLY website: it has no
-- backend server logic, no API, and no live database connection.
-- All forms (patient information, appointment booking, contact,
-- newsletter) are handled entirely in script.js as client-side
-- demonstrations — nothing is written to a database anywhere.
--
-- This file is included only as an illustrative reference for
-- what a future backend's data model *could* look like, mirroring
-- the fields shown in the frontend forms. It is not imported,
-- executed, or connected to by any file in this project.
-- =========================================================

CREATE TABLE IF NOT EXISTS patients (
    patient_id       VARCHAR(20) PRIMARY KEY,
    full_name        VARCHAR(120) NOT NULL,
    age              SMALLINT,
    gender           VARCHAR(30),
    date_of_birth    DATE,
    blood_group      VARCHAR(5),
    height_cm        DECIMAL(5,2),
    weight_kg        DECIMAL(5,2),
    phone            VARCHAR(30),
    email            VARCHAR(150),
    address          VARCHAR(255),
    emergency_contact VARCHAR(30),
    insurance_provider VARCHAR(120),
    existing_diseases  TEXT,
    allergies          TEXT,
    medical_history    TEXT,
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS doctors (
    doctor_id        VARCHAR(20) PRIMARY KEY,
    full_name        VARCHAR(120) NOT NULL,
    specialization   VARCHAR(120),
    registration_no  VARCHAR(40),
    years_experience SMALLINT,
    languages        VARCHAR(120),
    consultation_timings VARCHAR(120),
    hospital_affiliations VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS departments (
    department_id    SERIAL PRIMARY KEY,
    name             VARCHAR(120) NOT NULL
);

CREATE TABLE IF NOT EXISTS appointments (
    appointment_id   SERIAL PRIMARY KEY,
    patient_id       VARCHAR(20) REFERENCES patients(patient_id),
    doctor_id        VARCHAR(20) REFERENCES doctors(doctor_id),
    department_id    INTEGER REFERENCES departments(department_id),
    preferred_date   DATE NOT NULL,
    preferred_time   TIME NOT NULL,
    visit_type       VARCHAR(30),
    consultation_type VARCHAR(30),
    notes            TEXT,
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS prescriptions (
    prescription_id  SERIAL PRIMARY KEY,
    patient_id       VARCHAR(20) REFERENCES patients(patient_id),
    doctor_id        VARCHAR(20) REFERENCES doctors(doctor_id),
    issued_date      DATE DEFAULT CURRENT_DATE,
    instructions     TEXT
);

CREATE TABLE IF NOT EXISTS prescription_items (
    item_id          SERIAL PRIMARY KEY,
    prescription_id  INTEGER REFERENCES prescriptions(prescription_id),
    medicine_name    VARCHAR(150),
    dosage           VARCHAR(60),
    frequency        VARCHAR(80),
    duration         VARCHAR(60)
);

CREATE TABLE IF NOT EXISTS testimonials (
    testimonial_id   SERIAL PRIMARY KEY,
    patient_name     VARCHAR(120),
    rating           SMALLINT CHECK (rating BETWEEN 1 AND 5),
    review_text      TEXT,
    treatment_received VARCHAR(120)
);
