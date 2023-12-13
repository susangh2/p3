async function loadMealRecord() {
  let res = await fetch('/meal');
  let meals = await res.json();
  //   console.log(meals);
  if (meals.error) {
    console.log(meals.error);
    return;
  }
  for (let meal of meals) {
    let node = everydayMealTemplate.content.firstElementChild.cloneNode(true);
    meal.node = node;
    console.log(node);
    foodPhoto = meal.user_photo_filename;
    node.querySelector('img').src = `../mealphotos/${foodPhoto}`;
    let date = new Date(meal.created_at).toISOString().split('T')[0];
    node.querySelector('.meal-date').textContent = `Meal Date: ${date}`;
    const capitalizedMealName = meal.name.toUpperCase();
    node.querySelector(
      '.food-name',
    ).textContent = `Food: ${capitalizedMealName}`;
    node.querySelector('.calories').textContent = `Calories: ${meal.calories}`;
    node.querySelector('.protein').textContent = `Protein: ${meal.protein}`;
    node.querySelector(
      '.carbohydrates',
    ).textContent = `Carbohydrates: ${meal.carbohydrates}`;
    node.querySelector('.fat').textContent = `Fat: ${meal.fat}`;
    node.querySelector(
      '.portion',
    ).textContent = `Serving Size: ${meal.serving}`;
    console.log('portion:', node.querySelector('.portion'));
    console.log('deletebtn:', node.querySelector('.del-btn'));
    node.querySelector('.del-btn').addEventListener('click', function () {
      deleteMeal(meal);
    });
    toprow.appendChild(node);
  }
}
loadMealRecord();

function showMealRecord(meal) {
  let row;
  for (let i = 0; i < meal.length; i++) {
    if (i % 3 == 0) {
      row = document.createElement('div');
      row.classList.add('row');
      allmeals.appendChild(row);
    }
    let node = everydayMealTemplate.content.firstElementChild.cloneNode(true);
    meal[i].node = node;
    foodPhoto = meal[i].user_photo_filename;
    node.querySelector('img').src = `../mealphotos/${foodPhoto}`;
    node.querySelector('.meal-date').textContent = `Meal Date: ${meal[i].date}`;
    const capitalizedMealName = meal[i].name.toUpperCase();
    node.querySelector(
      '.food-name',
    ).textContent = `Food : ${capitalizedMealName}`;
    node.querySelector(
      '.calories',
    ).textContent = `Calories: ${meal[i].calories}`;
    node.querySelector('.protein').textContent = `Protein: ${meal[i].protein}`;
    node.querySelector(
      '.carbohydrates',
    ).textContent = `Carbohydrates: ${meal[i].carbohydrates}`;
    node.querySelector('.fat').textContent = `Fat: ${meal[i].fat}`;
    node.querySelector(
      '.portion',
    ).textContent = `Serving Size: ${meal[i].serving}`;
    node.querySelector('.del-btn').addEventListener('click', function () {
      deleteMeal(meal[i]);
    });
    row.appendChild(node);
  }
}

async function mealDateFilter(event) {
  // let query = new URLSearchParams();
  // query.set('mealstart', mealstart.value);
  // query.set('mealstart', mealend.value);
  let res = await fetch(
    'meal/filter?' +
      new URLSearchParams({ from: mealstart.value, to: mealend.value }),
  );
  let result = await res.json();
  allmeals.innerHTML = '';
  showMealRecord(result);
}

function triggerDeleteButton() {
  const editBtn = document.querySelector('.edit-btn');
  const delBtns = document.querySelectorAll('.del-btn');

  for (let i = 0; i < delBtns.length; i++) {
    const delBtn = delBtns[i];
    delBtn.style.display =
      delBtn.style.display === 'none' ? 'inline-block' : 'none';
  }
}

async function deleteMeal(meal) {
  console.log('delete meal', meal);
  let res = await fetch('/meal/' + meal.id, { method: 'Delete' });
  let json = await res.json();
  if (json.error) {
    // alert(error);
    Swal.fire({
      icon: 'error',
      title: error,
      text: 'Something went wrong!',
    });
    return;
  }
  meal.node.remove();
}
