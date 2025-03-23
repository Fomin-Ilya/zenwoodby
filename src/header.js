const burgerToggle = document.getElementById("burger-toggle");
const menuLinks = document.querySelectorAll("nav ul li a");

menuLinks.forEach((link) => {
  link.addEventListener("click", () => {
    burgerToggle.checked = false;
  });
});
