const forgot = document.querySelector('#forgot-password-form');

forgot.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.querySelector('#email').value;

  try {
    const response = await fetch('user/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    const result = await response.json();
    console.log({ result });
    if (response.ok) {
      alert('Please check your email.');
      window.location = '/';

      //result.url
    } else {
      alert('Please enter a valid email address.');
      return;
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
});
