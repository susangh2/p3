// let path = require('path');

async function getPhoto() {
  const { value: file } = await Swal.fire({
    title: 'Select image',
    input: 'file',
    inputAttributes: {
      accept: 'image/*',
      'aria-label': 'Upload your profile picture',
    },
  });

  console.log('FILE:', file);

  if (!file) return;

  let formData = new FormData();
  formData.set('file', file);

  //   let res = await fetch('/user/upload', {
  //     method: 'POST',
  //     body: formData,
  //   });
  //   let json = await res.json();

  let res = await fetch('/user/upload', {
    method: 'POST',
    body: formData,
  });
  let json = await res.json();

  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       Swal.fire({
  //         title: 'Your uploaded picture',
  //         imageUrl: e.target.result,
  //         imageAlt: 'The uploaded picture',
  //       });
  //     };
  //     reader.readAsDataURL(file);
  //   }
  console.log(json);
  //   console.log('result json', json.result.results[0].name);

  //   console.log('filePath', json.file.path);
  //   let filePath = path.resolve;
  let foodName = json.result.results[0].name;
  let fileName = json.filename;

  //   let currentPath = __dirname;
  //   console.log('current Path', currentPath);

  if (json.result) {
    console.log('well received with thanks');
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: true,
    });

    let response = await Swal.fire({
      title: 'Hello!',
      inputAttributes: {
        autocapitalize: 'off',
      },
      text: 'Your food is ' + foodName + '?',
      imageUrl: '/mealphotos/' + fileName,
      //   imageWidth: 400,
      //   imageHeight: 200,
      imageAlt: 'Custom image',
      showCancelButton: true,
      confirmButtonText: 'Yes, it is!',
      cancelButtonText: 'No, retake~',
      reverseButtons: true,
    });

    if (!response.isConfirmed) {
      getPhoto();
      return;
    }

    let wait = await swalWithBootstrapButtons.fire(
      'Done!',
      'Your file has been saved.',
      'success',
    );

    let body = { foodName, fileName };

    confirmedRes = await fetch('/user/confirmResult', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    confirmedJson = await confirmedRes.json();

    foodName = confirmedJson.confirmedResult.food[0].name;
    let calories = confirmedJson.confirmedResult.food[0].calories;
    let protein = confirmedJson.confirmedResult.food[0].protein;
    let fat = confirmedJson.confirmedResult.food[0].fat;
    let carbohydrates = confirmedJson.confirmedResult.food[0].carbohydrates;
    let serving = confirmedJson.confirmedResult.food[0].serving;

    if (wait) {
      Swal.fire({
        title: foodName + '!',
        text:
          'calories: ' +
          calories +
          '\n' +
          'protein: ' +
          protein +
          '\nfat: ' +
          fat +
          '\ncarbohydrates: ' +
          carbohydrates +
          '\nserving: ' +
          serving,
        imageUrl: '/mealphotos/' + fileName,
        // imageWidth: 400,
        // imageHeight: 200,
        imageAlt: 'Custom image',
      });
      console.log('IIIIIi waittedddd');
      console.log('confirmedJson', confirmedJson.confirmedResult.food[0]);
    }
  }
}

// getPhoto();
