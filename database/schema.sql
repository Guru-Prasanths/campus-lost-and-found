-- ====================================================
-- Campus Lost & Found - Database Setup Script
-- Run this script to create the database in MySQL
-- ====================================================

-- Create the database
CREATE DATABASE IF NOT EXISTS campus_lost_found
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE campus_lost_found;

-- Note: Tables are auto-created by Hibernate (spring.jpa.hibernate.ddl-auto=update)
-- This script is for manual setup if needed

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    college_id VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(15),
    department VARCHAR(100),
    year_of_study VARCHAR(50),
    password VARCHAR(255) NOT NULL,
    role ENUM('STUDENT', 'STAFF', 'ADMIN') NOT NULL DEFAULT 'STUDENT',
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME,
    updated_at DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Items table
CREATE TABLE IF NOT EXISTS items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(150) NOT NULL,
    category ENUM('ELECTRONICS', 'ID_CARDS', 'WALLETS_MONEY', 'BOOKS_NOTES', 'BAGS', 'CLOTHING', 'ACCESSORIES', 'KEYS', 'DOCUMENTS', 'OTHER') NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    approximate_time TIME,
    image_path VARCHAR(500),
    private_details TEXT,
    item_type ENUM('LOST', 'FOUND') NOT NULL,
    status ENUM('ACTIVE', 'CLAIMED', 'RETURNED', 'CLOSED') NOT NULL DEFAULT 'ACTIVE',
    reported_by_id BIGINT NOT NULL,
    created_at DATETIME,
    updated_at DATETIME,
    FOREIGN KEY (reported_by_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Claims table
CREATE TABLE IF NOT EXISTS claims (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    item_id BIGINT NOT NULL,
    claimant_id BIGINT NOT NULL,
    proof_of_ownership TEXT NOT NULL,
    additional_info TEXT,
    verification_question_answer TEXT,
    status ENUM('PENDING', 'APPROVED', 'REJECTED', 'UNDER_REVIEW') NOT NULL DEFAULT 'PENDING',
    admin_notes TEXT,
    created_at DATETIME,
    updated_at DATETIME,
    resolved_at DATETIME,
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
    FOREIGN KEY (claimant_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    `read` BOOLEAN NOT NULL DEFAULT FALSE,
    link VARCHAR(500),
    created_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Indexes for performance
CREATE INDEX idx_items_status ON items(status);
CREATE INDEX idx_items_type ON items(item_type);
CREATE INDEX idx_items_category ON items(category);
CREATE INDEX idx_items_date ON items(date);
CREATE INDEX idx_items_reporter ON items(reported_by_id);
CREATE INDEX idx_claims_status ON claims(status);
CREATE INDEX idx_claims_item ON claims(item_id);
CREATE INDEX idx_claims_claimant ON claims(claimant_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(`read`);

SELECT 'Database setup complete!' AS status;

