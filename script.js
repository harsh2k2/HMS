function sendRequest(method, url, data, callback) {
  var req = new XMLHttpRequest();
  req.open(method, url);
  req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  req.send(data);

  req.onreadystatechange = function () {
    if (req.readyState == 4 && req.status == 200) {
      callback(req.responseText);
    }
  };
}

function submitForm(event) {
  event.preventDefault();
  var formElements = [
    "patient_name",
    "register_patient_phone",
    "patient_email",
    "dob",
    "gender",
    "patient_address",
  ];
  var data = formElements
    .map((id) => `${id}=${document.getElementById(id).value}`)
    .join("&");

  sendRequest("POST", "/register", data, function (response) {
    document.getElementById("request").innerHTML = response;
    formElements.forEach((id) => (document.getElementById(id).value = ""));
  });

  return false;
}

function loginForm(event) {
  event.preventDefault();
  var patient_phone = document.getElementById("login_patient_phone").value;

  sendRequest(
    "POST",
    "/login",
    `patient_phone=${patient_phone}`,
    function (response) {
      document.getElementById("loginRequest").innerHTML = response;

      console.log(response);
    }
  );

  return false;
}

function otpFormSection(event) {
  event.preventDefault();
  var otp = document.getElementById("otp").value;

  sendRequest("POST", "/verify-otp", `otp=${otp}`, function (response) {
    try {
      var parsedResponse = JSON.parse(response);
      if (typeof parsedResponse === "object" && parsedResponse !== null) {
        document.getElementById("mr_number").textContent =
          parsedResponse.mrNumber;
        document.getElementById("user_name").textContent =
          parsedResponse.userName;
        document.querySelector(".registeration-complete").style.display =
          "block";
        loadHospitals();
      }
    } catch (e) {
      alert("Incorrect OTP entered");
    }
    document.getElementById("otp").value = "";
  });

  return false;
}

function loadHospitals() {
  sendRequest("GET", "/hospitals", null, function (response) {
    var hospitals = JSON.parse(response);
    var select = document.getElementById("hospital");
    hospitals.forEach(function (hospital) {
      var option = document.createElement("option");
      option.value = hospital.hospital_id;
      option.text = hospital.hospital_name;
      select.appendChild(option);
    });
  });
}

function handleHospitalChange() {
  var hospitalId = this.value;
  var departmentSelect = document.getElementById("department");
  departmentSelect.innerHTML = "";

  if (hospitalId) {
    sendRequest("GET", `/departments/${hospitalId}`, null, function (response) {
      var departments = JSON.parse(response);
      departments.forEach(function (department) {
        var option = document.createElement("option");
        option.value = department.department_id;
        option.text = department.department_name;
        departmentSelect.appendChild(option);
      });
    });
  }
}

function createDoctorCard(doctor, doctorSelectDiv) {
  var doctorCard = document.createElement("div");
  doctorCard.className = "doctor-card";

  doctorCard.innerHTML = `
    <h4>${doctor.doctor_name}</h4>              
    <p>Department: ${doctor.department_name}</p>
    <button class="book_appointment_btn">Book Your Appointment</button>
  `;
  doctorSelectDiv.appendChild(doctorCard);
  // console.log(doctor);
  doctorCard
    .querySelector(".book_appointment_btn")
    .addEventListener("click", function () {
      showDoctorDetails(doctor);
    });
}

function showDoctorDetails(doctor) {
  var doctorDetailsSection = document.querySelector(".doctor-details");

  var today = new Date().toISOString().split("T")[0];
  // console.log(doctor);
  doctorDetailsSection.innerHTML = `
                                      <h3>Doctor Details</h3>
                                      <p>Doctor Name: ${doctor.doctor_name}</p>
                                      <p>Department: ${doctor.department_name}</p>
                                      <p>Fee: ${doctor.fee}</p>
                                      <p>Hospital: ${doctor.hospital_name}</p>
                                      <label for="date_time">Select Date</label><br />
                                      <input type="date" id="date_time" name="date_time" min="${today}" required />
                                      <div id="slots"></div>
                                    `;

  doctorDetailsSection.style.display = "block";

  var dateTimePicker = document.getElementById("date_time");
  dateTimePicker.addEventListener("change", function () {
    var selectedDate = new Date(this.value);

    if (selectedDate.getDay() === 0) {
      alert("Sundays are not available. Please select another day.");
      this.value = "";
    } else {
      showSlots(doctor, selectedDate.toISOString().split("T")[0]);
    }
  });
}

function createSlotButton(slot, doctor, date) {
  var slotButton = document.createElement("button");
  slotButton.textContent = slot;
  slotButton.addEventListener("click", function () {
    fillAppointmentDetails(doctor, date, slot);
  });
  return slotButton;
}

function showSlots(doctor, date) {
  var slotsDiv = document.getElementById("slots");
  slotsDiv.innerHTML = "";

  var day = new Date(date).toLocaleString("en-US", { weekday: "long" });

  sendRequest(
    "GET",
    `/doctor-slots/${doctor.doctor_id}/${day}`,
    null,
    function (response) {
      var slots = JSON.parse(response);
      slots.forEach(function (slot) {
        var slotButton = createSlotButton(slot, doctor, date);
        slotsDiv.appendChild(slotButton);
      });
    }
  );
}

function handleDepartmentChange() {
  var departmentName = this.options[this.selectedIndex].text;
  var hospitalName =
    document.getElementById("hospital").options[
      document.getElementById("hospital").selectedIndex
    ].text;
  var doctorSelectDiv = document.getElementById("doctorDetails");

  sendRequest(
    "GET",
    `/doctors/${encodeURIComponent(departmentName)}/${encodeURIComponent(
      hospitalName
    )}`,
    null,
    function (response) {
      var doctors = JSON.parse(response);
      doctorSelectDiv.innerHTML = "";

      doctors.forEach(function (doctor) {
        createDoctorCard(doctor, doctorSelectDiv);
      });
    }
  );
}

// loadHospitals();

document
  .getElementById("hospital")
  .addEventListener("change", handleHospitalChange);

document
  .getElementById("department")
  .addEventListener("change", handleDepartmentChange);

function fillAppointmentDetails(doctor, date, slot) {
  var appointmentDetailsSection = document.querySelector(
    ".appointment-details"
  );

  appointmentDetailsSection.innerHTML = `
                                            <h3>Appointment Details</h3>
                                            <p>Date: ${date} ${slot}</p>

                                            <!-- <p>Time: ${slot}</p> -->

                                            <p>Doctor: ${doctor.doctor_name}</p>
                                            <p>Department: ${doctor.department_name}</p>
                                            <p>Type :	Walk-In</p>
                                            <p>Fee: ₹${doctor.fee}</p>
                                            <p>Center: ${doctor.hospital_name}</p>
                                            <button class="confirm_appointment_btn">Confirm Appointment</button>
                                          `;

  document
    .querySelector(".confirm_appointment_btn")
    .addEventListener("click", function () {
      console.log(doctor);

      var patient_phone = document.getElementById("login_patient_phone").value;
      console.log("Patient phone:", patient_phone);
      sendRequest(
        "GET",
        `/get_patient_id/${patient_phone}`,
        null,
        function (response) {
          var parsedResponse = JSON.parse(response);
          if (parsedResponse.patient_id) {
            var patient_id = parsedResponse.patient_id;
            // ... rest of the code to book the appointment ...

            var doctor_id = doctor.doctor_id;
            // var slot_id = slot;
            var slot_id = 5;
            var hospital_id = doctor.hospital_id;
            var appointment_date = date;

            var data = `patient_id=${patient_id}&doctor_id=${doctor_id}&slot_id=${slot_id}&hospital_id=${hospital_id}&appointment_date=${appointment_date}`;

            sendRequest("POST", "/book-appointment", data, function (response) {
              console.log(response);
              alert("Appointment confirmed. Pay fee at center.");
            });
          } else {
            alert("Failed to retrieve patient ID");
          }
        }
      );
    });
}

// hide wala code

document
  .getElementById("registerLink")
  .addEventListener("click", function (event) {
    event.preventDefault();
    document.getElementById("registerSection").style.display = "block"; // Show the register section
    document.getElementById("loginSection").style.display = "none"; // Hide the login section
    document.getElementById("otpFormSection").style.display = "none";
  });

document
  .getElementById("showLogin")
  .addEventListener("click", function (event) {
    event.preventDefault();
    document.getElementById("registerSection").style.display = "none"; // Show the register section
    document.getElementById("loginSection").style.display = "block"; // Hide the login section
    document.getElementById("otpFormSection").style.display = "block";
  });

document
  .getElementById("logged_in_book_appointment")
  .addEventListener("click", function (event) {
    event.preventDefault();
    document.getElementById("otpFormSection").style.display = "none";
    document.getElementById("loginSection").style.display = "none";
    // document.getElementByClass("registeration-complete").style.display = "none";
    document.getElementById("book-appointment").style.display = "block";
  });
