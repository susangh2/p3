async function getRole() {
  let res = await fetch('/user/role');
  let json = await res.json();
  console.log(json);
  if (!json.user_id) {
    document.body.dataset.role = 'guest';
  } else {
    document.body.dataset.role = 'user';
  }
}

getRole();

document
  .querySelector('.logout-nav-btn')
  .addEventListener('click', async function logout(event) {
    event.preventDefault();
    let res = await fetch('/user/logout', { method: 'POST' });
    let json = await res.json();
    console.log('logout result:', json);
    window.location.href = '/';
    if (json.error) {
      alert('Logout failed.');
    }
  });
