create database hospital;
use hospital; 

create table hospital(
hospital_id int primary key auto_increment,
hospital_name varchar(50),
hospital_phone varchar(15),
hospital_address text,
logo blob
);

INSERT INTO hospital (hospital_name, hospital_phone, hospital_address, logo) 
VALUES 
('City General Hospital', '1234567890', '123 Main Street, Cityville, USA', NULL),
('Sunrise Medical Center', '9876543210', '456 Elm Street, Townsville, USA', NULL),
('Oceanview Hospital', '5551234567', '789 Ocean Avenue, Beachtown, USA', NULL),
('Mountain View Hospital', '4445556666', '321 Mountain Road, Hilltown, USA', NULL);

desc hospital;
select * from hospital;



CREATE TABLE patient (
    patient_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_name VARCHAR(50),
    patient_phone varchar(15),
    patient_email varchar(50),
    dob date,
    gender ENUM('male', 'female'),
    patient_address text    
);
DESC patient;

ALTER TABLE patient
ADD COLUMN mr_no VARCHAR(50);

ALTER TABLE patient
CHANGE COLUMN mr_no mrNumber VARCHAR(50);



create table department(
department_id int primary key auto_increment,
department_name varchar(50)
);
desc department;
INSERT INTO department (department_name) 
VALUES 
('Cardiology'),
('Neurology'),
('Orthopedics'),
('Ophthalmology'),
('Pediatrics');

select* from department;


CREATE TABLE doctor(
doctor_id int auto_increment primary key,
doctor_name varchar(50),
doctor_phone varchar(15),
doctor_email varchar(50),
fee int,
department_id int,
hospital_id int,
slot_id int,
FOREIGN KEY (department_id) REFERENCES department(department_id),
FOREIGN KEY (hospital_id) REFERENCES hospital(hospital_id)
);

ALTER TABLE doctor
MODIFY COLUMN slot_id VARCHAR(255);


desc doctor;

INSERT INTO doctor (doctor_name, doctor_phone, doctor_email, fee, department_id, hospital_id, slot_id) 
VALUES 
('Dr. John Smith', '1234567890', 'john.smith@example.com', 100, 1, 1, 1),
('Dr. Emily Johnson', '9876543210', 'emily.johnson@example.com', 120, 2, 2, 2),
('Dr. Michael Davis', '5551234567', 'michael.davis@example.com', 150, 3, 3, 3),
('Dr. Sarah Williams', '4445556666', 'sarah.williams@example.com', 130, 4, 4, 4);

INSERT INTO doctor (doctor_name, doctor_phone, doctor_email, fee, department_id, hospital_id, slot_id) 
VALUES 
('Dr. Samantha Lee', '1231112222', 'samantha.lee@example.com', 110, 1, 1, 2),
('Dr. Kevin Brown', '9872223333', 'kevin.brown@example.com', 140, 2, 2, 3),
('Dr. Amanda Miller', '5553334444', 'amanda.miller@example.com', 170, 3, 3, 4),
('Dr. David Wilson', '4444445555', 'david.wilson@example.com', 160, 4, 4, 5),
('Dr. Jennifer Martinez', '1235556666', 'jennifer.martinez@example.com', 180, 1, 1, 6),
('Dr. Christopher Moore', '9876667777', 'christopher.moore@example.com', 190, 2, 2, 7),
('Dr. Elizabeth Taylor', '5557778888', 'elizabeth.taylor@example.com', 200, 3, 3, 8),
('Dr. Matthew Anderson', '4448889999', 'matthew.anderson@example.com', 210, 4, 4, 9),
('Dr. Jessica White', '1239990000', 'jessica.white@example.com', 220, 1, 1, 10),
('Dr. Daniel Garcia', '9870001111', 'daniel.garcia@example.com', 230, 2, 2, 11);
INSERT INTO doctor (doctor_name, doctor_phone, doctor_email, fee, department_id, hospital_id, slot_id) 
VALUES 
('Dr. Tony Stark', '8524568524', 'tonystrar@example.com', 110, 4, 1, 2),
('Dr. James Brown', '7412589637', 'jamesbr@example.com', 140, 2, 4, 3);

INSERT INTO doctor (doctor_name, doctor_phone, doctor_email, fee, department_id, hospital_id, slot_id) 
VALUES 
('Dr. bhaji Stark', '1234445555', 'tonystrar@example.com', 110, 4, 1, '1,2,3,4,5,6'),
('Dr. sid th', '9875556666', 'jamesbr@example.com', 140, 2, 4, '1,2,3,4,5,6');

select * from doctor where doctor_phone="1234445555" ;
select * from doctor;


SELECT * FROM department;
SELECT * 
FROM doctor 
JOIN department ON doctor.department_id = department.department_id 
WHERE department.department_name = 'Cardiology';


select * from appointment;

select * from doctor;




CREATE TABLE doctor_slots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    doctor_id INT,
    slot_Day VARCHAR(20) NOT NULL,
    slot_Time JSON,
    FOREIGN KEY (doctor_id) REFERENCES doctor(doctor_id)
);
desc doctor_slots;


select * from doctor;





SET SQL_SAFE_UPDATES = 0;

INSERT INTO doctor_slots (doctor_id, slot_Day, slot_Time)
VALUES (1,'Monday', '["09:00 AM", "09:30 AM", "10:00 AM"]'),
(1,'Tuesday', '["09:00 AM", "09:30 AM", "10:00 AM"]'),
(1,'Wednesday', '["09:00 AM", "09:30 AM", "10:00 AM"]'),
(1,'Thursday', '["09:00 AM", "09:30 AM", "10:00 AM"]'),
(1,'Friday', '["09:00 AM", "09:30 AM", "10:00 AM"]'),
(1,'Saturday', '["09:00 AM", "09:30 AM", "10:00 AM"]');

UPDATE doctor_slots
SET slot_Time = '["09:00 AM", "09:20 AM", "09:40 AM", "10:00 AM"]'
WHERE doctor_id = 19 AND slot_Day = 'Monday';

select * from doctor_slots;
select slot_Time from doctor_slots where doctor_id='1' and slot_Day='Monday';
select slot_Time from doctor_slots where slot_Day='Monday';





CREATE TABLE appointment (
    appointment_id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT,
    doctor_id INT, 
    slot_id INT,
    hospital_id INT,
    appointment_date DATE,
    FOREIGN KEY (patient_id) REFERENCES patient(patient_id),
    FOREIGN KEY (doctor_id) REFERENCES doctor(doctor_id),
    FOREIGN KEY (slot_id) REFERENCES dateSlot(slot_id),
    FOREIGN KEY (hospital_id) REFERENCES hospital(hospital_id)
);




desc appointment;
select * from appointment;

create table otp(
patient_id int,
patient_phone varchar(15),
otp int,
foreign key (patient_id) references patient(patient_id),
foreign key (patient_phone) references patient(patient_phone)
);
desc otp;


ALTER TABLE patient
ADD INDEX idx_patient_phone (patient_phone);


INSERT INTO patient (patient_name, patient_phone, patient_email, dob, gender, patient_address) 
VALUES ('James Bond', '4561237891', 'james.bond@example.com', '1998-05-02', 'male', '123 Main St, New York, America');

select * from patient;
DELETE FROM patient;
ALTER TABLE patient AUTO_INCREMENT = 1;

delete from patient where patient_id='2';

DELETE FROM doctor;
ALTER TABLE doctor AUTO_INCREMENT = 1;

desc patient;

select * from patient;



SET SQL_SAFE_UPDATES = 0;


