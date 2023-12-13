document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('#update-password-form');
  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match. Please try again.');
      return;
    }
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');

      const response = await fetch(`/user/update-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newPassword }),
      });
      const result = await response.json();
      console.log({ result });
      if (response.ok) {
        alert('Password Updated.');
        window.location = '/';
      } else {
        alert('Password update fail.');
        return;
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  });
});

// function getResetToken() {
//   // Replace with your logic to retrieve the reset token from the URL or any other source
//   // For example, you can use URLSearchParams to get the token from the query string
//   const searchParams = new URLSearchParams(window.location.search);
//   return searchParams.get('token');
// }
