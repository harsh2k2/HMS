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

// load hospitals during registration
function loadHospitals() {
  sendRequest("GET", "/hospitals", null, function (response) {
    console.log(response);
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

// function to submit doctor registration form
function submitForm(event) {
  event.preventDefault();
  var formElements = [
    "doctor_name",
    "register_doctor_phone",
    "doctor_email",
    "fee",
    "hospital",
    "department",
  ];
  var data = formElements
    .map((id) => `${id}=${document.getElementById(id).value}`)
    .join("&");

  sendRequest("POST", "/doctor_register", data, function (response) {
    document.getElementById("request").innerHTML = response;
    formElements.forEach((id) => (document.getElementById(id).value = ""));
  });

  return false;
}

// function to submit doctor login form
function loginForm(event) {
  event.preventDefault();
  var doctor_phone = document.getElementById("login_doctor_phone").value;

  sendRequest(
    "POST",
    "/doctor_login",
    `doctor_phone=${doctor_phone}`,
    function (response) {
      document.getElementById("loginRequest").innerHTML = response;
      document.getElementById("login_doctor_phone").value = "";
    }
  );

  return false;
}

loadHospitals(); // load hospitals when the page loads

// function to update slots in the database of the doctor who has logged in on clicking the update button
function updateSlots(event) {
  event.preventDefault();

  if (!document.getElementById("slotTimes").value) {
    alert("Please enter slot times");
    return;
  }

  sendRequest("GET", "/get_doctor_id", null, function (response) {
    var doctorId = JSON.parse(response).doctorId;
    console.log(doctorId);

    // document.getElementById("doctorId").value = "19";
    // var doctorId = document.getElementById("doctorId").value; // manually setting

    var day = document.getElementById("slotDay").value;
    var slotTimes = document
      .getElementById("slotTimes")
      .value.split(",")
      .map((time) => time.trim());

    var data = `doctorId=${doctorId}&day=${day}&slots=${JSON.stringify(
      slotTimes
    )}`;
    console.log(JSON.stringify(slotTimes));

    sendRequest("POST", "/update_slots", data, function (response) {
      document.getElementById("doctorSlots").innerHTML = response;
      document.getElementById("slotTimes").value = "";
    });
  });

  return false;
}

document
  .getElementById("updateSlotsButton")
  .addEventListener("click", updateSlots);

// Load departments during registration
function loadDepartments() {
  sendRequest("GET", "/departments", null, function (response) {
    console.log(response);
    var departments = JSON.parse(response);
    var select = document.getElementById("department");
    departments.forEach(function (department) {
      var option = document.createElement("option");
      option.value = department.department_id;
      option.text = department.department_name;
      select.appendChild(option);
    });
  });
}

// Call loadDepartments when the page loads
loadDepartments();