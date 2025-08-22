CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE bases (
    base_id SERIAL PRIMARY KEY,
    base_name VARCHAR(100) NOT NULL,
    location VARCHAR(150)
);

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role_id INT NOT NULL REFERENCES roles(role_id),
    base_id INT REFERENCES bases(base_id), -- NULL means global (e.g., Admin)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE assets (
    asset_id SERIAL PRIMARY KEY,
    asset_type VARCHAR(50) NOT NULL,     -- e.g., Rifle, Truck, Ammo
    description TEXT,
    serial_number VARCHAR(100),          -- optional for unique items
    base_id INT NOT NULL REFERENCES bases(base_id),
    status VARCHAR(30) DEFAULT 'available', -- available, assigned, expended, transferred
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE purchases (
    purchase_id SERIAL PRIMARY KEY,
    base_id INT NOT NULL REFERENCES bases(base_id),
    asset_type VARCHAR(50) NOT NULL,
    quantity INT NOT NULL,
    purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT REFERENCES users(user_id)
);

CREATE TABLE transfers (
    transfer_id SERIAL PRIMARY KEY,
    from_base_id INT NOT NULL REFERENCES bases(base_id),
    to_base_id INT NOT NULL REFERENCES bases(base_id),
    asset_type VARCHAR(50) NOT NULL,
    quantity INT NOT NULL,
    transfer_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT REFERENCES users(user_id)
);

CREATE TABLE assignments (
    assignment_id SERIAL PRIMARY KEY,
    base_id INT NOT NULL REFERENCES bases(base_id),
    asset_type VARCHAR(50) NOT NULL,
    quantity INT NOT NULL,
    assigned_to VARCHAR(100), -- could be unit/soldier name or personnel_id if detailed table exists
    assignment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT REFERENCES users(user_id)
);

CREATE TABLE expenditures (
    expenditure_id SERIAL PRIMARY KEY,
    base_id INT NOT NULL REFERENCES bases(base_id),
    asset_type VARCHAR(50) NOT NULL,
    quantity INT NOT NULL,
    reason TEXT,
    expenditure_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT REFERENCES users(user_id)
);

CREATE TABLE audit_log (
    log_id SERIAL PRIMARY KEY,
    action_type VARCHAR(50) NOT NULL,   -- purchase, transfer, assignment, expenditure
    user_id INT REFERENCES users(user_id),
    asset_type VARCHAR(50),
    details JSONB,                     
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);