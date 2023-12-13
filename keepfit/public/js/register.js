const form = document.querySelector('#registrationForm');
// const submitBtn = document.querySelector('#submitBtn');

form.addEventListener('submit', async (event) => {
  console.log('submitting...');

  event.preventDefault();

  if (password.value != confirmPassword.value) {
    alert('password not match!');
    return;
  }

  const formData = new FormData(form);
  const registrationData = Object.fromEntries(formData.entries());
  console.log(typeof registrationData.height);

  try {
    const response = await fetch('user/registration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registrationData),
    });
    const result = await response.json();
    console.log({ result });
    if (response.ok) {
      // Registration successful
      // console.log('Registration successful', result.url);
      window.location = '/';

      //result.url
    } else {
      alert(result.message ? result.message : 'Registration failed');
    }
  } catch (error) {
    console.error('An error occurred during registration:', error);
  } finally {
    submitBtn.disabled = false;
  }
});

// function showError(message) {
//   const errorContainer = document.getElementById('errorContainer');
//   errorContainer.textContent = message;
//   errorContainer.style.display = 'block';
// }
