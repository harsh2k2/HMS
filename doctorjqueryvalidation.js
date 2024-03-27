$(document).ready(function () {
  $("#doctorRegistrationForm").validate({
    rules: {
      doctor_name: {
        required: true,
        minlength: 2,
      },
      register_doctor_phone: {
        required: true,
        digits: true,
        minlength: 10,
        maxlength: 10,
      },
      doctor_email: {
        required: true,
        email: true,
      },
      fee: {
        required: true,
        number: true,
      },
      hospital: {
        required: true,
      },
      department: {
        required: true,
      },
    },
    messages: {
      doctor_name: {
        required: "Please enter your name",
        minlength: "Your name must be at least 2 characters long",
      },
      register_doctor_phone: {
        required: "Please enter your phone number",
        digits: "Please enter only digits",
        minlength: "Your phone number must be 10 digits long",
        maxlength: "Your phone number must be 10 digits long",
      },
      doctor_email: {
        required: "Please enter your email address",
        email: "Please enter a valid email address",
      },
      fee: {
        required: "Please enter your fee",
        number: "Please enter a valid number",
      },
      hospital: {
        required: "Please select a hospital",
      },
      department: {
        required: "Please select a department",
      },
    },
    submitHandler: function (form) {
      submitForm();
    },
  });
  $("#doctorLoginForm").validate({
    rules: {
      login_doctor_phone: {
        required: true,
        digits: true,
        minlength: 10,
        maxlength: 10,
      },
    },
    messages: {
      login_doctor_phone: {
        required: "Please enter your phone number",
        digits: "Please enter only digits",
        minlength: "Your phone number must be 10 digits long",
        maxlength: "Your phone number must be 10 digits long",
      },
    },
    submitHandler: function (form) {
      loginForm(form);
    },
  });
});
