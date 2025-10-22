-- Database schema for Coffee Shop React App
CREATE DATABASE IF NOT EXISTS coffeeshop_db;
USE coffeeshop_db;

-- Newsletter subscription table
CREATE TABLE IF NOT EXISTS `subscribe` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `email` varchar(255) NOT NULL UNIQUE,
    `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
);

-- Contact messages table
CREATE TABLE IF NOT EXISTS `contact` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `name` varchar(255) NOT NULL,
    `email` varchar(255) NOT NULL,
    `message` text NOT NULL,
    `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
);

-- Orders table
CREATE TABLE IF NOT EXISTS `orders` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `customer_name` varchar(255) NOT NULL,
    `product` text NOT NULL,
    `quantity` int(11) NOT NULL,
    `total` decimal(10,2) NOT NULL,
    `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
);
