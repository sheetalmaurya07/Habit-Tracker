CREATE DATABASE habit_tracker;

USE habit_tracker;

DROP TABLE IF EXISTS `habit_points`;
DROP TABLE IF EXISTS `habits`;
DROP TABLE IF EXISTS `users`;


CREATE TABLE users (
   id INT AUTO_INCREMENT PRIMARY KEY,
   full_name VARCHAR(200) NULL,
   user_name VARCHAR(50) NOT NULL,
   email VARCHAR(100) NOT NULL,
   password VARCHAR(255) NOT NULL
);


CREATE TABLE habits (
   id INT AUTO_INCREMENT PRIMARY KEY,
   user_id INT NOT NULL,
   habit_name VARCHAR(100) NOT NULL,
   start_date DATE NOT NULL,
   end_date DATE NULL,
   target_value INT NULL,
   target_unit VARCHAR(20) NULL,
   status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
   archived_at DATETIME NULL,
   created_at DATETIME NOT NULL,
   FOREIGN KEY (user_id) REFERENCES users(id)
);


CREATE TABLE habit_points (
   id INT AUTO_INCREMENT PRIMARY KEY,
   habit_id INT NOT NULL,
   scheduled_date DATE NOT NULL,
   status varchar(20) NOT NULL DEFAULT 'PENDING',
   points INT NULL,
   completed_at DATETIME NULL,
   created_at DATETIME NOT NULL,   
   FOREIGN KEY (habit_id) REFERENCES habits(id),
   CONSTRAINT hbt_hbtid_schdate UNIQUE (habit_id, scheduled_date)
);

DROP TABLE IF EXISTS `mst_calendar`;
CREATE TABLE mst_calendar (
    id INT AUTO_INCREMENT PRIMARY KEY,
    c_date DATE NOT NULL
); 