const con = require("./connection.js");
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const app = express();

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure session middleware
app.use(
  session({
    secret: "hello", // secret string of choice
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // true if your application is served over HTTPS
  })
);

con.connect(function (error) {
  if (error) console.log(error);
  console.log("Connected to the database");
});

app.set("view engine", "ejs");

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/register.html");
});

app.get("/doctor", function (req, res) {
  res.sendFile(__dirname + "/doctor.html");
});

// Register a patient
app.post("/register", function (req, res) {
  const {
    patient_name,
    register_patient_phone,
    patient_email,
    dob,
    gender,
    patient_address,
  } = req.body;

  const mrNumber = "HSP" + (Math.floor(Math.random() * 1000000) + 1);

  const sql =
    "INSERT INTO patient (patient_name, patient_phone, patient_email, dob, gender, patient_address, mrNumber) VALUES ?";

  const values = [
    [
      patient_name,
      register_patient_phone,
      patient_email,
      dob,
      gender,
      patient_address,
      mrNumber,
    ],
  ];

  con.query(sql, [values], function (error, result) {
    if (error) console.log(error);
    res.send("Patient Registered successfully");
  });
});

// Register a doctor
app.post("/doctor_register", function (req, res) {
  const {
    doctor_name,
    register_doctor_phone,
    doctor_email,
    fee,
    hospital,
    department,
  } = req.body;

  const sql =
    "INSERT INTO doctor (doctor_name, doctor_phone, doctor_email, fee, department_id, hospital_id) VALUES ?";

  const values = [
    [
      doctor_name,
      register_doctor_phone,
      doctor_email,
      fee,
      department,
      hospital,
    ],
  ];

  con.query(sql, [values], function (error, result) {
    if (error) console.log(error);

    const sql2 = `INSERT INTO doctor_slots (doctor_id, slot_Day, slot_Time) VALUES (${result.insertId},'Monday', '["09:00 AM", "09:30 AM", "10:00 AM"]'), (${result.insertId},'Tuesday', '["09:00 AM", "09:30 AM", "10:00 AM"]'), (${result.insertId},'Wednesday', '["09:00 AM", "09:30 AM", "10:00 AM"]'), (${result.insertId},'Thursday', '["09:00 AM", "09:30 AM", "10:00 AM"]'), (${result.insertId},'Friday', '["09:00 AM", "09:30 AM", "10:00 AM"]'), (${result.insertId},'Saturday', '["09:00 AM", "09:30 AM", "10:00 AM"]')`;

    con.query(sql2, function (error, result) {
      if (error) console.log(error);
      console.log("insertid" + result.insertId);
      res.send("Doctor Registered successfully");
    });
  });
});

// patient login
// app.post("/login", function (req, res) {
//   const { patient_phone } = req.body;

//   const sql =
//     "SELECT patient_id,patient_name, patient_phone, mrNumber FROM patient WHERE patient_phone = ?";

//   con.query(sql, [patient_phone], function (error, result) {
//     if (error) {
//       console.log("Query execution failed:", error);
//       res.send("Query execution failed");
//       return;
//     }
//     console.log("Query result:", result);
//     if (result.length > 0) {
//       // Generate a random OTP
//       const otp = Math.floor(100000 + Math.random() * 900000);
//       // Store the OTP in the session
//       req.session.otp = otp;
//       req.session.userName = result[0].patient_name;
//       req.session.mrNumber = result[0].mrNumber;
//       // Send the OTP to the user
//       res.send({ message: "Registered user. Enter OTP", otp });
//     } else {
//       res.send("Phone number not found");
//     }
//   });
// });

// patient login
app.post("/login", function (req, res) {
  const { patient_phone } = req.body;

  const sql =
    "SELECT patient_id,patient_name, patient_phone, mrNumber FROM patient WHERE patient_phone = ?";

  con.query(sql, [patient_phone], function (error, result) {
    if (error) {
      console.log("Query execution failed:", error);
      res.json({ error: "Query execution failed" });
      return;
    }
    console.log("Query result:", result);
    if (result.length > 0) {
      // Generate a random OTP
      const otp = Math.floor(100000 + Math.random() * 900000);
      // Store the OTP in the session
      req.session.otp = otp;
      req.session.userName = result[0].patient_name;
      req.session.mrNumber = result[0].mrNumber;
      // Send the OTP to the user
      res.json({ message: "Registered user. Enter OTP", otp });
    } else {
      res.json({ error: "Phone number not found" });
    }
  });
});

// Add this route to get the patient_id by patient_phone
app.get("/get_patient_id/:patient_phone", function (req, res) {
  const patient_phone = req.params.patient_phone;
  const sql = "SELECT patient_id FROM patient WHERE patient_phone = ?";

  con.query(sql, [patient_phone], function (error, result) {
    if (error) {
      console.log("Query execution failed:", error);
      res.send("Query execution failed");
      return;
    }
    if (result.length > 0) {
      res.send({ patient_id: result[0].patient_id });
    } else {
      res.send("Phone number not found");
    }
  });
});

// doctor login without OTP verification
app.post("/doctor_login", function (req, res) {
  const { doctor_phone } = req.body;

  const sql =
    "SELECT doctor_id,doctor_name, department_id FROM doctor WHERE doctor_phone = ?";

  con.query(sql, [doctor_phone], function (error, result) {
    if (error) {
      console.log("Query execution failed:", error);
      res.send("Query execution failed");
      return;
    }
    console.log("Query result:", result);
    if (result.length > 0) {
      // Directly log in the user without OTP verification
      req.session.userName = result[0].doctor_name;
      req.session.departmentId = result[0].department_id;
      req.session.doctorId = result[0].doctor_id;
      res.send({
        message: "Logged in successfully",
        userName: req.session.userName,
        doctorId: req.session.doctorId,
      });
    } else {
      res.send("Phone number not found");
    }
  });
});

// Get the doctor_id from the session
app.get("/get_doctor_id", function (req, res) {
  if (req.session.doctorId) {
    res.send({ doctorId: req.session.doctorId });
  } else {
    res.send({ error: "Doctor ID not found in session" });
  }
});

app.post("/verify-otp", function (req, res) {
  const { otp } = req.body;
  if (otp == req.session.otp) {
    const userDetails = {
      mrNumber: req.session.mrNumber,
      userName: req.session.userName,
    };
    res.send(userDetails);
  } else {
    res.send("OTP verification failed");
  }
});

// Fetch all hospitals
app.get("/hospitals", function (req, res) {
  con.query("SELECT * FROM hospital", function (error, results) {
    if (error) throw error;
    res.send(results);
  });
});

// Fetch departments by hospital ID
app.get("/departments/:hospitalId", function (req, res) {
  const hospitalId = req.params.hospitalId;
  console.log("hospitalId", hospitalId);
  con.query(
    // "SELECT * FROM department where department_id IN (SELECT department_id  FROM doctor WHERE hospital_id = ?)",
    "SELECT DISTINCT d.department_id, d.department_name FROM department d INNER JOIN doctor doc ON d.department_id = doc.department_id WHERE doc.hospital_id = ?",
    [hospitalId],
    function (error, results) {
      if (error) throw error;
      res.send(results);
    }
  );
});

app.get("/doctors/:department/:hospital", function (req, res) {
  const department = req.params.department;
  const hospital = req.params.hospital;

  con.query(
    "SELECT doctor.*, department.department_name, hospital.hospital_name FROM doctor JOIN department ON doctor.department_id = department.department_id JOIN hospital ON doctor.hospital_id = hospital.hospital_id WHERE department.department_name = ? AND hospital.hospital_name = ?",
    [department, hospital],
    function (error, results) {
      if (error) throw error;
      res.send(results);
    }
  );
});

app.get("/doctor-slots/:doctorId/:day", function (req, res) {
  const doctorId = req.params.doctorId;
  const day = req.params.day;
  const sql =
    "SELECT slot_Time FROM doctor_slots WHERE doctor_id = ? AND slot_Day = ?";

  con.query(sql, [doctorId, day], function (error, results) {
    if (error) throw error;
    const slots = JSON.parse(results[0].slot_Time);
    res.send(slots);
  });
});

//  to get doctor-specific slots
app.get("/doctor-slots/:doctorId", function (req, res) {
  const doctorId = req.params.doctorId;
  const sql =
    "SELECT slot_Day, slot_Time FROM doctor_slots WHERE doctor_id = ?";

  con.query(sql, [doctorId], function (error, results) {
    if (error) throw error;
    res.send(results);
  });
});

//  to book an appointment
app.post("/book-appointment", function (req, res) {
  const {
    appointment_id,
    patient_id,
    doctor_id,
    slot_id,
    hospital_id,
    appointment_date,
  } = req.body;

  const sql =
    "INSERT INTO appointment (patient_id, doctor_id, slot_id, hospital_id, appointment_date) VALUES (?, ?, ?, ?, ?)";

  con.query(
    sql,
    [patient_id, doctor_id, slot_id, hospital_id, appointment_date],
    function (error, result) {
      if (error) {
        console.log("Query execution failed:", error);
        // res.send("Query execution failed");
        return;
      }
      res.send("Appointment booked successfully");
    }
  );
});

// function to update slots in the database of the doctor who has logged in
// app.post("/update_slots", function (req, res) {
//   const { doctorId, day, slots } = req.body;

//   const sql =
//     "UPDATE doctor_slots SET slot_Time = ? WHERE doctor_id = ? AND slot_Day = ?";

//   con.query(sql, [slots, doctorId, day], function (error, result) {
//     if (error) throw error;
//     res.send("Doctor slots updated successfully");
//   });
// });

// function to update slots in the database of the doctor who has logged in
// index.js
// ...

// function to update slots in the database of the doctor who has logged in
app.post("/update_slots", function (req, res) {
  const { doctorId, day, slots } = req.body;

  // Parse the JSON string back into an object
  const slotTimes = JSON.parse(slots);

  // Convert the array of slots to a JSON string
  const slotTimesJson = JSON.stringify(slotTimes);

  const sql =
    "UPDATE doctor_slots SET slot_Time = ? WHERE doctor_id = ? AND slot_Day = ?";

  con.query(sql, [slotTimesJson, doctorId, day], function (error, result) {
    if (error) throw error;
    res.send("Doctor slots updated successfully");
  });
});

// ...
// Fetch all departments during doctor registration
app.get("/departments", function (req, res) {
  con.query("SELECT * FROM department", function (error, results) {
    if (error) throw error;
    res.send(results);
  });
});

app.listen(8080);
