function calcUserDetail(userDetails) {
  let { sex, weight, height, active_level_id, birthday } = userDetails;
  // birthday = new Date('1996-01-30');

  let active_metabolic_rate = {
    1: 1.375,
    2: 1.55,
    3: 1.725,
    4: 1.9,
  }[active_level_id];
  // if (active_level == 1) {
  //   active_metabolic_rate = 1.375;
  // } else if (active_level == 2) {
  //   active_metabolic_rate = 1.55;
  // } else if (active_level == 3) {
  //   active_metabolic_rate = 1.725;
  // } else if (active_level == 4) {
  //   active_metabolic_rate = 1.9;
  // }

  let age = calcAge(birthday);
  console.log(age);

  let basal_metabolic_rate =
    sex == 'female'
      ? 655.1 + 9.563 * weight + 1.85 * height - 4.676 * age
      : 66.47 + 13.75 * weight + 5.003 * height - 6.755 * age;
  calories = Math.round(basal_metabolic_rate * active_metabolic_rate);
  let dailyCalories = calories;
  let weeklyCalories = dailyCalories * 7;

  return { dailyCalories, weeklyCalories };
}

function calcAge(birthday) {
  if ('new version') {
    let age = Date.now() - new Date(birthday).getTime();
    let SECOND = 1000;
    let MINUTE = SECOND * 60;
    let HOUR = MINUTE * 60;
    let DAY = HOUR * 24;
    let YEAR = DAY * 365.25;
    return Math.floor(age / YEAR);
  }

  // Extracting the year, month, and day from the birthday string
  const [birthYear, birthMonth, birthDay] = birthday.split('-');
  console.log(birthYear);
  console.log(birthMonth);
  console.log(birthDay);

  // Extracting the current year, month, and day
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const currentDay = currentDate.getDate();

  // Calculating the age
  let age = currentYear - Number(birthYear);
  console.log({ age });
  // Adjusting the age based on the current month and day
  if (
    currentMonth < Number(birthMonth) ||
    (currentMonth === Number(birthMonth) && currentDay < Number(birthDay))
  ) {
    age--;
  }
}

async function dailyCalories() {
  let res = await fetch('/summary/daily');
  let json = await res.json();
  console.log(json);
  if (json.error) {
    console.log('calories error:', error);
    return;
  }

  let { dailyIntake, userDetails } = json;

  let { dailyCalories } = calcUserDetail(userDetails);

  document.querySelector(
    '#daily-calories-needed',
  ).textContent = `Daily Calories Needed: ${dailyCalories}`;

  let dailyConsumption = dailyIntake.totalCalories
    ? dailyIntake.totalCalories
    : 0;
  document.querySelector(
    '#daily-calories-taken',
  ).textContent = `Daily Calories Intake: ${dailyConsumption}`;
  remainingCalories = dailyCalories - dailyConsumption;
  console.log(remainingCalories);
  // remainingCalories = -10;

  if (remainingCalories <= 0) {
    document.querySelector(
      '#daily-overconsumption-msg',
    ).textContent = `Overconsumption: ${remainingCalories} Calories`;
    dailyConsumption = dailyCalories;
    remainingCalories = 0;
  } else {
    document.querySelector('#daily-overconsumption-msg').textContent =
      'You are eating healthly!';
  }

  document.querySelector('.daily-date').textContent = new Date()
    .toISOString()
    .split('T')[0];

  const ctx = document.getElementById('dailyConsumption');
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Consumed', 'Available'],
      datasets: [
        {
          label: 'Calories',
          data: [dailyConsumption, remainingCalories],
          // data: [2632, 1000],
          backgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)'],
          hoverOffset: 4,
        },
      ],
    },
    options: { responsive: true },
  });
}
dailyCalories();

async function weeklyCalories() {
  const currentDate = new Date();
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay()); // Assuming Sunday is the first day of the week
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  const startDateString = startOfWeek.toISOString().split('T')[0];
  const endDateString = endOfWeek.toISOString().split('T')[0];
  console.log({ startDateString });
  console.log({ endDateString });

  let res = await fetch(
    '/summary/weekly?' +
      new URLSearchParams({ from: startDateString, to: endDateString }),
  );

  // const urlSearchParams = new URLSearchParams({
  //   from: startDateString,
  //   to: endDateString,
  // });
  // const queryString = urlSearchParams.toString();
  // console.log(queryString);

  let json = await res.json();

  if (json.error) {
    alert(json.error);
    return;
  }

  let { weeklyIntake, userDetails } = json;

  let { weeklyCalories } = calcUserDetail(userDetails);

  document.querySelector(
    '#weekly-calories-needed',
  ).textContent = `Weekly Calories Needed: ${weeklyCalories}`;

  console.log(weeklyIntake);

  // if (!weeklyIntake) {
  //   weeklyConsumption = 0;
  // } else {
  //   weeklyConsumption = weeklyIntake.total_weekly_calories;
  // }
  let weeklyConsumption = weeklyIntake ? weeklyIntake.total_weekly_calories : 0;

  document.querySelector(
    '#weekly-calories-taken',
  ).textContent = `Weekly Calories Intake: ${weeklyConsumption}`;
  remainingCalories = weeklyCalories - weeklyConsumption;
  console.log(remainingCalories);
  // remainingCalories = -10;

  if (remainingCalories <= 0) {
    document.querySelector(
      '#weekly-overconsumption-msg',
    ).textContent = `Overconsumption: ${remainingCalories} Calories`;
    weeklyConsumption = weeklyCalories;
    remainingCalories = 0;
  } else {
    document.querySelector('#weekly-overconsumption-msg').textContent =
      'You are eating healthly!';
  }
  document.querySelector(
    '.weekly-period',
  ).textContent = `${startDateString} - ${endDateString}`;

  const ctxweek = document.getElementById('weeklyConsumption');

  new Chart(ctxweek, {
    type: 'doughnut',
    data: {
      labels: ['Consumed', 'Available'],
      datasets: [
        {
          label: 'Calories',
          data: [weeklyConsumption, remainingCalories],
          // data: [18424, 16000],
          backgroundColor: ['rgb(255, 205, 86)', 'rgb(54, 162, 235)'],
          hoverOffset: 4,
        },
      ],
    },
  });
}
weeklyCalories();
