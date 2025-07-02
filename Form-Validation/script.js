

// JavaScript Form Validation Project
// Author: [Bharath Mohan]
// Description: Handles form validation, user feedback, and response management for the registration form.

document.addEventListener('DOMContentLoaded', function () {
  // --- Element References ---
  const form = document.getElementById('registrationForm');
  const fullName = document.getElementById('fullname');
  const email = document.getElementById('email');
  const phone = document.getElementById('phone');
  const password = document.getElementById('password');
  const confirmPassword = document.getElementById('confirmPassword');
  const fields = [fullName, email, phone, password, confirmPassword];

  // --- Helper Functions ---

  // Show error message and style
  function showError(input, message) {
    const errorElem = document.getElementById(input.id + 'Error');
    if (errorElem) errorElem.innerText = message;
    input.classList.add('is-invalid');
    input.classList.remove('is-valid');
  }

  // Clear error message and style
  function clearError(input) {
    const errorElem = document.getElementById(input.id + 'Error');
    if (errorElem) errorElem.innerText = '';
    input.classList.remove('is-invalid', 'is-valid');
  }

  // Set valid style
  function setValid(input) {
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
  }

  // --- Validation Functions ---

  // Validate Full Name (min 5 chars, only alphabets and spaces)
  function validateName() {
    const nameVal = fullName.value.trim();
    if (nameVal.length < 5) {
      showError(fullName, 'Name must be at least 5 characters');
      return false;
    }
    if (!/^[A-Za-z ]+$/.test(nameVal)) {
      showError(fullName, 'Name must contain only letters and spaces');
      return false;
    }
    setValid(fullName);
    clearError(fullName);
    return true;
  }

  // Validate Email (must contain @ and .domain)
  function validateEmail() {
    const emailVal = email.value.trim();
    const emailPattern = /^[^@\s]+@[^@\s]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(emailVal)) {
      showError(email, 'Enter a valid email address');
      return false;
    }
    setValid(email);
    clearError(email);
    return true;
  }

  // Validate Phone (10 digits, not 1234567890)
  function validatePhone() {
    const val = phone.value.trim();
    if (!/^\d{10}$/.test(val) || val === '1234567890') {
      showError(phone, 'Enter a valid 10-digit phone number');
      return false;
    }
    setValid(phone);
    clearError(phone);
    return true;
  }

  // Validate Password (min 8 chars, not 'password' or name)
  function validatePassword() {
    const val = password.value;
    const nameVal = fullName.value.trim().toLowerCase();
    if (
      val.length < 8 ||
      val.toLowerCase() === 'password' ||
      val.toLowerCase() === nameVal
    ) {
      showError(password, 'Password is too weak');
      return false;
    }
    setValid(password);
    clearError(password);
    return true;
  }

  // Validate Confirm Password (must match password)
  function validateConfirmPassword() {
    if (confirmPassword.value !== password.value || password.value.length === 0) {
      showError(confirmPassword, 'Passwords do not match');
      return false;
    }
    setValid(confirmPassword);
    clearError(confirmPassword);
    return true;
  }

  // --- Real-time Validation ---
  fullName.addEventListener('input', validateName);
  email.addEventListener('input', validateEmail);
  phone.addEventListener('input', validatePhone);
  password.addEventListener('input', validatePassword);
  confirmPassword.addEventListener('input', validateConfirmPassword);

  // --- Enter Key Navigation (only if valid) ---
  fields.forEach((input, idx) => {
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        let isCurrentValid = false;
        if (input === fullName) isCurrentValid = validateName();
        else if (input === email) isCurrentValid = validateEmail();
        else if (input === phone) isCurrentValid = validatePhone();
        else if (input === password) isCurrentValid = validatePassword();
        else if (input === confirmPassword) isCurrentValid = validateConfirmPassword();
        if (isCurrentValid) {
          if (idx < fields.length - 1) {
            fields[idx + 1].focus();
          } else {
            form.requestSubmit();
          }
        }
      }
    });
  });

  // --- Form Submission ---
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    let valid = true;
    if (!validateName()) valid = false;
    if (!validateEmail()) valid = false;
    if (!validatePhone()) valid = false;
    if (!validatePassword()) valid = false;
    if (!validateConfirmPassword()) valid = false;

    if (valid) {
      // Save user to localStorage
      const users = JSON.parse(localStorage.getItem('submittedUsers')) || [];
      users.push(fullName.value.trim());
      localStorage.setItem('submittedUsers', JSON.stringify(users));
      setTimeout(updateSubmissionStats, 0); // Update stats after DOM reset
      alert('Form submitted successfully!');
      form.reset();
      fields.forEach(clearError);
    }
  });

  // --- Response Management ---

  // Update responder stats and list
  function updateSubmissionStats() {
    const users = JSON.parse(localStorage.getItem('submittedUsers')) || [];
    const countElem = document.getElementById('userCount');
    const listElem = document.getElementById('userList');
    if (countElem) countElem.innerText = `${users.length} people have responded`;
    if (listElem) {
      listElem.innerHTML = '';
      users.forEach((name, idx) => {
        const li = document.createElement('li');
        li.innerText = name + ' ';
        // Add delete button
        const delBtn = document.createElement('button');
        delBtn.innerText = 'Delete';
        delBtn.className = 'btn btn-sm btn-danger ms-2';
        delBtn.onclick = function() {
          users.splice(idx, 1);
          localStorage.setItem('submittedUsers', JSON.stringify(users));
          updateSubmissionStats();
        };
        li.appendChild(delBtn);
        listElem.appendChild(li);
      });
    }
  }

  // Toggle responder list on count click
  const countElem = document.getElementById('userCount');
  if (countElem) {
    countElem.addEventListener('click', function() {
      const listElem = document.getElementById('userList');
      if (listElem) {
        listElem.style.display = listElem.style.display === 'none' ? 'block' : 'none';
      }
    });
  }

  // Clear all responses
  const clearBtn = document.getElementById('clearResponses');
  if (clearBtn) {
    clearBtn.addEventListener('click', function() {
      if (confirm('Are you sure you want to clear all responses?')) {
        localStorage.removeItem('submittedUsers');
        updateSubmissionStats();
      }
    });
  }

  // Initialize responder stats on load
  setTimeout(updateSubmissionStats, 0);
});