-- PostgreSQL Schema for Used Bike Showroom Management System

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) DEFAULT '$2a$10$demoHashedPasswordGoesHere',
    role VARCHAR(30) NOT NULL CHECK (role IN ('admin', 'staff', 'customer')),
    phone VARCHAR(30),
    avatar TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bikes (
    id VARCHAR(64) PRIMARY KEY,
    stock_id VARCHAR(50) UNIQUE NOT NULL,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(150) NOT NULL,
    variant VARCHAR(150),
    year INT NOT NULL,
    reg_year INT,
    reg_number VARCHAR(50) UNIQUE NOT NULL,
    km_driven INT NOT NULL,
    fuel_type VARCHAR(30) DEFAULT 'Petrol',
    engine_cc INT,
    mileage VARCHAR(40),
    color VARCHAR(60),
    owner_count INT DEFAULT 1,
    insurance_status VARCHAR(80),
    insurance_expiry DATE,
    rc_status VARCHAR(80),
    bike_condition VARCHAR(50),
    purchase_price NUMERIC(12, 2) NOT NULL,
    expected_price NUMERIC(12, 2) NOT NULL,
    selling_price NUMERIC(12, 2) NOT NULL,
    status VARCHAR(30) DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'sold')),
    photos TEXT[], -- Array of image URLs
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inspections (
    id VARCHAR(64) PRIMARY KEY,
    bike_id VARCHAR(64) REFERENCES bikes(id) ON DELETE CASCADE,
    engine VARCHAR(30) DEFAULT 'Good',
    battery VARCHAR(30) DEFAULT 'Good',
    tyres VARCHAR(30) DEFAULT 'Good',
    brake VARCHAR(30) DEFAULT 'Good',
    suspension VARCHAR(30) DEFAULT 'Good',
    clutch VARCHAR(30) DEFAULT 'Good',
    gearbox VARCHAR(30) DEFAULT 'Good',
    electrical VARCHAR(30) DEFAULT 'Good',
    lights VARCHAR(30) DEFAULT 'Good',
    body VARCHAR(30) DEFAULT 'Good',
    paint VARCHAR(30) DEFAULT 'Good',
    accident_history VARCHAR(100) DEFAULT 'None',
    service_history VARCHAR(150) DEFAULT 'Verified',
    overall_score INT DEFAULT 90,
    status VARCHAR(30) DEFAULT 'Passed' CHECK (status IN ('Passed', 'Failed')),
    notes TEXT,
    inspected_by VARCHAR(120),
    inspected_date DATE DEFAULT CURRENT_DATE
);

CREATE TABLE IF NOT EXISTS purchases (
    id VARCHAR(64) PRIMARY KEY,
    bike_id VARCHAR(64) REFERENCES bikes(id) ON DELETE CASCADE,
    seller_name VARCHAR(120) NOT NULL,
    seller_phone VARCHAR(30) NOT NULL,
    seller_address TEXT,
    seller_id_proof VARCHAR(100),
    purchase_price NUMERIC(12, 2) NOT NULL,
    payment_mode VARCHAR(50),
    purchase_date DATE DEFAULT CURRENT_DATE,
    notes TEXT
);

CREATE TABLE IF NOT EXISTS customers (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    email VARCHAR(150),
    address TEXT,
    budget NUMERIC(12, 2),
    interested_brand VARCHAR(100),
    interested_model VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS enquiries (
    id VARCHAR(64) PRIMARY KEY,
    customer_id VARCHAR(64) REFERENCES customers(id) ON DELETE SET NULL,
    customer_name VARCHAR(120) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    bike_id VARCHAR(64) REFERENCES bikes(id) ON DELETE SET NULL,
    bike_title VARCHAR(150),
    stage VARCHAR(40) DEFAULT 'new' CHECK (stage IN ('new', 'contacted', 'interested', 'test_ride', 'negotiation', 'booking', 'sold', 'lost')),
    budget NUMERIC(12, 2),
    source VARCHAR(80),
    assigned_to VARCHAR(120),
    follow_up_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS test_rides (
    id VARCHAR(64) PRIMARY KEY,
    customer_name VARCHAR(120) NOT NULL,
    customer_phone VARCHAR(30) NOT NULL,
    bike_id VARCHAR(64) REFERENCES bikes(id) ON DELETE CASCADE,
    bike_title VARCHAR(150),
    scheduled_date DATE NOT NULL,
    scheduled_time VARCHAR(30) NOT NULL,
    staff_name VARCHAR(120),
    status VARCHAR(30) DEFAULT 'scheduled' CHECK (status IN ('requested', 'scheduled', 'completed', 'cancelled')),
    feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bookings (
    id VARCHAR(64) PRIMARY KEY,
    booking_number VARCHAR(50) UNIQUE NOT NULL,
    bike_id VARCHAR(64) REFERENCES bikes(id) ON DELETE CASCADE,
    bike_title VARCHAR(150),
    customer_name VARCHAR(120) NOT NULL,
    customer_phone VARCHAR(30) NOT NULL,
    booking_amount NUMERIC(12, 2) NOT NULL,
    agreed_price NUMERIC(12, 2) NOT NULL,
    pending_amount NUMERIC(12, 2) NOT NULL,
    booking_date DATE DEFAULT CURRENT_DATE,
    expected_delivery DATE,
    payment_mode VARCHAR(50),
    status VARCHAR(30) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled'))
);

CREATE TABLE IF NOT EXISTS sales (
    id VARCHAR(64) PRIMARY KEY,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    bike_id VARCHAR(64) REFERENCES bikes(id) ON DELETE CASCADE,
    bike_title VARCHAR(150),
    customer_name VARCHAR(120) NOT NULL,
    customer_phone VARCHAR(30) NOT NULL,
    customer_address TEXT,
    vehicle_price NUMERIC(12, 2) NOT NULL,
    discount NUMERIC(12, 2) DEFAULT 0,
    rto_transfer_charges NUMERIC(12, 2) DEFAULT 0,
    insurance_charges NUMERIC(12, 2) DEFAULT 0,
    total_amount NUMERIC(12, 2) NOT NULL,
    paid_amount NUMERIC(12, 2) NOT NULL,
    payment_mode VARCHAR(50),
    sale_date DATE DEFAULT CURRENT_DATE,
    delivery_date DATE,
    delivery_status VARCHAR(50) DEFAULT 'Delivered',
    documents_handed TEXT[]
);

CREATE TABLE IF NOT EXISTS expenses (
    id VARCHAR(64) PRIMARY KEY,
    bike_id VARCHAR(64) REFERENCES bikes(id) ON DELETE CASCADE,
    expense_type VARCHAR(50) NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    description TEXT,
    expense_date DATE DEFAULT CURRENT_DATE
);
