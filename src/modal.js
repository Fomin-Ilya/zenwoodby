document.getElementById("buy").addEventListener("click", () => {
  document.getElementById("modalWrapper").classList.add("active");
});

document.getElementById("cross").addEventListener("click", () => {
  document.getElementById("modalWrapper").classList.remove("active");
});

document.getElementById("modalWrapper").addEventListener("click", (e) => {
  if (e.target.id === "modalWrapper") {
    document.getElementById("modalWrapper").classList.remove("active");
  }
});

emailjs.init("zvYD6mQZ-myn0fg4o");

function uploadImage(file) {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "zenwood");
    formData.append("cloud_name", "dlbwz5pnt");

    fetch("https://api.cloudinary.com/v1_1/dlbwz5pnt/image/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => resolve(data.secure_url))
      .catch((error) => reject(error));
  });
}

document.getElementById("orderForm").addEventListener("submit", function (e) {
  e.preventDefault();

  let isValid = true;
  let color = null;
  const lightButton = document.getElementById("light");
  const darkButton = document.getElementById("dark");

  const lightButtonColor = window.getComputedStyle(lightButton).backgroundColor;
  const darkButtonColor = window.getComputedStyle(darkButton).backgroundColor;

  const hexColor = rgbToHex(lightButtonColor); // Конвертируем в hex цвет для light
  if (hexColor === "#55dd4a") {
    color = "light";
  }

  const hexColorDark = rgbToHex(darkButtonColor); // Конвертируем в hex цвет для dark
  if (hexColorDark === "#55dd4a") {
    color = "dark";
  }

  const nameInput = document.getElementById("name");
  const phoneInput = document.getElementById("phone");
  const commentInput = document.getElementById("comment");
  const leftImageInput = document.getElementById("leftImage");
  const rightImageInput = document.getElementById("rightImage");

  const nameError = nameInput.nextElementSibling;
  const phoneError = phoneInput.nextElementSibling;
  const commentError = commentInput.nextElementSibling;

  document
    .querySelectorAll(".error-message")
    .forEach((el) => (el.textContent = ""));
  document
    .querySelectorAll("input, textarea")
    .forEach((el) => el.classList.remove("error"));

  const nameLength = nameInput.value.trim().length;
  if (nameLength < 5) {
    nameError.textContent = "ФИО должно содержать минимум 5 символов";
    nameInput.classList.add("error");
    isValid = false;
  } else if (nameLength > 200) {
    nameError.textContent = "ФИО должно быть меньше 200 символов";
    nameInput.classList.add("error");
    isValid = false;
  }

  const phoneRegex = /^[\d+\-()\s]{9,19}$/;
  if (!phoneRegex.test(phoneInput.value.trim())) {
    phoneError.textContent = "Введите номер в корректном формате";
    phoneInput.classList.add("error");
    isValid = false;
  }

  if (commentInput.value.trim().length > 500) {
    commentError.textContent =
      "Комментарий должен содержать не более 500 символов";
    commentInput.classList.add("error");
    isValid = false;
  }

  if (isValid) {
    const uploadLeftImage = leftImageInput.files[0]
      ? uploadImage(leftImageInput.files[0])
      : Promise.resolve(null);
    const uploadRightImage = rightImageInput.files[0]
      ? uploadImage(rightImageInput.files[0])
      : Promise.resolve(null);

    Promise.all([uploadLeftImage, uploadRightImage])
      .then(([leftImageUrl, rightImageUrl]) => {
        const emailParams = {
          name: nameInput.value,
          phone: phoneInput.value,
          comment: commentInput.value,
          leftImage: leftImageUrl,
          rightImage: rightImageUrl,
          color: color,
        };

        emailjs.send("service_c65h0dn", "template_9sesdgv", emailParams).then(
          function () {
            alert("Заказ отправлен!");
            document.getElementById("modalWrapper").classList.remove("active");
            document.getElementById("orderForm").reset();
          },
          function (error) {
            console.error("Ошибка при отправке формы:", error);
            alert("Ошибка! Попробуйте снова.");
          }
        );
      })
      .catch((error) => {
        console.error("Ошибка загрузки изображений:", error);
        alert("Ошибка загрузки изображений. Попробуйте снова.");
      });
  }
});
