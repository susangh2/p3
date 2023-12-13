async function loadprofile() {
  await loadActiveLevel();

  let res = await fetch('/user/profile');
  let json = await res.json();
  if (json.error) {
    console.log('Profile loading error:', error);
  }
  document.querySelector('.username').value = json.username;
  document.querySelector('.email').value = json.email;
  const responseFromBackend = json.sex;
  const radioElement = document.querySelector(
    `input[type="radio"][name="sex"][value="${responseFromBackend}"]`,
  );
  radioElement.checked = true;
  let birthday = new Date(json.birthday).toISOString().split('T')[0];
  document.querySelector('.birthday').value = birthday;
  document.querySelector('.height').value = json.height;
  document.querySelector('.weight').value = json.weight;
  document.querySelector('.ideal_weight').value = json.ideal_weight;
  // const dropdownList = document.querySelector('#active_level');
  console.log(document.querySelector('#active_level'));
  console.log('dropdownlist:', document.querySelector('#active_level').options);
  // console.log('dropdownlist:', dropdownList.selectedIndex);
  document.getElementById('active_level').value = json.active_level_id;
  console.log(
    'dropdownlist:',
    document.getElementById('active_level').selectedIndex,
  );
}
loadprofile();

async function updateProfile(event) {
  event.preventDefault();
  let form = event.target;
  // let params = new URLSearchParams(location.search);
  // let userid = params.get('id');
  // let res = await fetch(form.action.replace(':id', userid), {
  let res = await fetch(form.action, {
    method: form.method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: form.username.value,
      email: form.email.value,
      sex: form.sex.value,
      birthday: form.birthday.value,
      height: form.height.value,
      weight: form.weight.value,
      active_level_id: form.active_level.value,
      ideal_weight: form.ideal_weight.value,
    }),
  });
  let json = await res.json();
  if (json.error) {
    console.log(json.error);
    return;
  }
  Swal.fire('Updated successfully', '', 'success');
  form.reset();
}

async function logout(event) {
  event.preventDefault();
  let res = await fetch('/user/logout', { method: 'POST' });
  let json = await res.json();
  console.log('logout result:', json);
  window.location.href = '/';
  if (json.error) {
    alert('Logout failed.');
  }
}

async function loadActiveLevel() {
  let res = await fetch('/user/activelevel');
  let json = await res.json();
  console.log(json);
  for (let i = 0; i < json.length; i++) {
    let option = document.createElement('option');
    option.value = json[i].id;
    option.textContent = json[i].active_level;
    active_level.appendChild(option);
  }
}
