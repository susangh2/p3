// let monthlyActualConsumption;

// getJSON('/user/meal', (json) => {
//   const totalCalories = json.totalCalories;
//   // let userTarget = json.userTarget;
//   // userTarget.user_intake = json.totalCalories;
//   const userIntakeElement = document.querySelector('[data-text="user_intake"]');
//   monthlyActualConsumption = totalCalories;
//   // Check if the element exists before updating its content
//   if (userIntakeElement) {
//     userIntakeElement.textContent = `${totalCalories} `;
//   }

//   console.log(totalCalories);

//   // renderTemplate(profileNode, json);
// });

let selectedExercise = 'running';

function showUserTarget() {
  getJSON('/user/target', (json) => {
    console.log('user target:', json);
    if (json.error) {
      alert('Failed to get user target: ' + json.error);
      return;
    }

    let { userTarget, sportsSelection, averageDailyCalories } = json;
    userTarget.daily_need = userTarget.sex == 'female' ? 2000 : 2500;
    userTarget.kg_to_reduce = userTarget.weight - userTarget.ideal_weight;
    userTarget.kcal_per_kg = 7700;
    userTarget.kcal_to_reduce =
      userTarget.kcal_per_kg * userTarget.kg_to_reduce;

    if (userTarget.sex == 'female') {
      userTarget.sex = 'Female';
    }

    if (userTarget.sex == 'male') {
      userTarget.sex = 'Male';
    }
    if (userTarget.active_level == 'lightly active') {
      userTarget.active_level = 'Lightly Active';
    }
    if (userTarget.active_level == 'moderately active') {
      userTarget.active_level = 'Moderately Active';
    }
    if (userTarget.active_level == 'active') {
      userTarget.active_level = 'Active';
    }
    if (userTarget.active_level == 'very active') {
      userTarget.active_level = 'Very Active';
    }

    let monthlyNeedConsumption = userTarget.daily_need * 30.25;
    let monthlyActualConsumption = Math.round(averageDailyCalories * 30.25);
    let userRun;
    let activeLevelConversionRate;
    let runPerWeek;

    userTarget.user_intake = monthlyActualConsumption;

    console.log(sportsSelection[0].sport_name);

    let timesPerWeek = [];
    timesPerWeek[1] = 2;
    timesPerWeek[2] = 4;
    timesPerWeek[3] = 5;
    timesPerWeek[4] = 7.5;

    let amountsPerTime = [];
    amountsPerTime[1] = 1;
    amountsPerTime[2] = 1;
    amountsPerTime[3] = 1;
    amountsPerTime[4] = 1.5;

    let getExercisePerWeek = {
      running: ({ timePerWeek, amountPerTime }) =>
        `run ${timePerWeek} times per week, ${amountPerTime * 10}km each time`,
      swimming: ({ timePerWeek, amountPerTime }) =>
        `swim ${timePerWeek} times per week, ${amountPerTime}hr each time`,
      walking: ({ timePerWeek, amountPerTime }) =>
        `walk ${timePerWeek} times per week, ${amountPerTime}hr each time`,
    };

    let sports_consumption = {};
    for (let sport of sportsSelection) {
      sports_consumption[sport.sport_name] = sport.consumption;
    }
    let selected_sport_consumption =
      sports_consumption[selectedExercise] || sportsSelection[0].consumption;

    console.log('Selected sport name:', selectedExercise);
    console.log('Selected sport consumption:', selected_sport_consumption);

    /**
     * Example
     *
     * actual intake 2500
     * monthly need 2000
     * want extra reduce 200
     *
     * monthly_amount_to_burn = 2500 - 2000 + 200
     */

    let monthly_amount_to_burn =
      monthlyActualConsumption -
      monthlyNeedConsumption +
      userTarget.kcal_to_reduce;

    let weekly_burn_amount =
      selected_sport_consumption *
      timesPerWeek[userTarget.active_level_id] *
      amountsPerTime[userTarget.active_level_id];

    let weeks_needed = monthly_amount_to_burn / weekly_burn_amount;

    userTarget.weeks_needed = weeks_needed.toFixed(1);

    userTarget.exercise_per_week = getExercisePerWeek[selectedExercise]({
      timePerWeek: timesPerWeek[userTarget.active_level_id],
      amountPerTime: amountsPerTime[userTarget.active_level_id],
    });

    userTarget.selected_exercise = selectedExercise;

    renderTemplate(profileNode, json);
  });
}
showUserTarget();

function selectExercise(value) {
  selectedExercise = value;
  showUserTarget();
}

// getJSON('/user/meal', (json) => {
//   const totalCalories = json.totalCalories;
//   // let userTarget = json.userTarget;
//   // userTarget.user_intake = json.totalCalories;
//   const userIntakeElement = document.querySelector('[data-text="user_intake"]');
//   monthlyActualConsumption = totalCalories;
//   // Check if the element exists before updating its content
//   if (userIntakeElement) {
//     userIntakeElement.textContent = `${totalCalories} `;
//   }

//   // renderTemplate(profileNode, json);
// });

//   function realActiveRate() {
//     if (userTarget.active_level_id == 1) {
//       activeLevelConversionRate = 1200;
//     } else if (userTarget.active_level_id == 2) {
//       activeLevelConversionRate = 2400;
//     } else if (userTarget.active_level_id == 3) {
//       activeLevelConversionRate = 3000;
//     } else if (userTarget.active_level_id == 4) {
//       activeLevelConversionRate = 4500;
//     }
//     return Number(activeLevelConversionRate);
//   }

//   function runRate() {
//     if (userTarget.active_level_id == 1) {
//       runPerWeek = 'run 2 times per week, 10km each time';
//     } else if (userTarget.active_level_id == 2) {
//       runPerWeek = 'run 4 times per week, 10km each time';
//     } else if (userTarget.active_level_id == 3) {
//       runPerWeek = 'run 5 times per week, 10km each time';
//     } else if (userTarget.active_level_id == 4) {
//       runPerWeek = 'run 5 times per week, 15km each time';
//     }
//     return runPerWeek;
//   }

// function compileRate(activityLevel) {
//   switch (activityLevel) {
//     case 1:
//       activeLevelConversionRate = 2;
//       runPerWeek = 'run 2 times per week, 10km each time';
//       break;
//     case 2:
//       activeLevelConversionRate = 4;
//       runPerWeek = 'run 4 times per week, 10km each time';
//       break;
//     case 3:
//       activeLevelConversionRate = 5;
//       runPerWeek = 'run 5 times per week, 10km each time';
//       break;
//     case 4:
//       activeLevelConversionRate = 7.5;
//       runPerWeek = 'run 5 times per week, 15km each time';
//       break;
//     default:
//       activeLevelConversionRate = 0;
//       runPerWeek = 'An Error Occurred';
//   }
// }

// // const activitySelect = document.querySelector('#activity-select');

// // activitySelect.addEventListener('change', function () {
// //   compileRate(activitySelect.value);
// // });

// function userShouldRun() {
//   // realActiveRate();
//   // runRate();
//   compileRate(userTarget.active_level_id);
//   if (userTarget.sex == 'female') {
//     userRun = Math.round(
//       (userTarget.kcal_to_reduce -
//         monthlyNeedConsumption +
//         monthlyActualConsumption) /
//         activeLevelConversionRate,
//     );
//   } else {
//     userRun = Math.round(
//       (userTarget.kcal_to_reduce -
//         monthlyNeedConsumption +
//         monthlyActualConsumption) /
//         activeLevelConversionRate,
//     );
//   }
//   return userRun;
// }

// userRun = userShouldRun();
// userTarget.user_should_run = userRun;
// userTarget.user_should_run_per_week = runPerWeek;
