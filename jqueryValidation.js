$(document).ready(function () {
  // Validation for the signup form
  $("#signupform").validate({
    rules: {
      patient_name: {
        required: true,
      },
      patient_phone: {
        required: true,
        minlength: 10,
        maxlength: 10,
        digits: true,
      },
      patient_email: {
        required: true,
        email: true,
      },
      dob: {
        required: true,
      },
      gender: {
        required: true,
      },
      patient_address: {
        required: true,
      },
    },
    messages: {
      patient_name: {
        required: "Please enter your name",
      },
      patient_phone: {
        required: "Please enter your phone number",
        minlength: "Your phone number must be exactly 10 digits",
        maxlength: "Your phone number must be exactly 10 digits",
        digits: "Please enter only digits",
      },
      patient_email: {
        required: "Please enter your email",
        email: "Please enter a valid email",
      },
      dob: {
        required: "Please enter your date of birth",
      },
      gender: {
        required: "Please select your gender",
      },
      patient_address: {
        required: "Please enter your address",
      },
    },
  });

  // Validation for the login form
  $("#loginform").validate({
    rules: {
      patient_phone: {
        required: true,
        minlength: 10,
        maxlength: 10,
        digits: true,
      },
    },
    messages: {
      patient_phone: {
        required: "Please enter your phone number",
        minlength: "Your phone number must be exactly 10 digits",
        maxlength: "Your phone number must be exactly 10 digits",
        digits: "Please enter only digits",
      },
    },
  });

  // Validation for the OTP form
  $("#otpForm").validate({
    rules: {
      otp: {
        required: true,
        minlength: 6,
        maxlength: 6,
        digits: true,
      },
    },
    messages: {
      otp: {
        required: "Please enter the OTP",
        minlength: "Your OTP must be exactly 6 digits",
        maxlength: "Your OTP must be exactly 6 digits",
        digits: "Please enter only digits",
      },
    },
  });
});
