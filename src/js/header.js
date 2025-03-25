const burgerToggle = document.getElementById("burger-toggle");
const menuLinks = document.querySelectorAll("nav ul li a");
const navigateToConstructorButton = document.getElementById(
  "navigate-to-constructor-button"
);

navigateToConstructorButton.addEventListener("click", () => {
  const target = document.getElementById("constructor");

  // Плавная прокрутка с дополнительными настройками
  target.scrollIntoView({
    behavior: "smooth", // анимация прокрутки
    block: "start", // вертикальное выравнивание (start/center/end/nearest)
    inline: "nearest", // горизонтальное выравнивание
  });
});

menuLinks.forEach((link) => {
  link.addEventListener("click", () => {
    burgerToggle.checked = false;
  });
});
