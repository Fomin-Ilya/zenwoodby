// Получаем все блоки с вопросами
const questions = document.querySelectorAll(".question");

// Добавляем обработчик клика на каждый блок
questions.forEach((question) => {
  question.addEventListener("click", () => {
    const block = question.closest(".block");

    // Проверяем, открыт ли уже блок
    const isOpen = block.classList.contains("open");

    // Закрываем все блоки
    // document.querySelectorAll(".block").forEach((block) => {
    //   block.classList.remove("open");
    // });

    // Если блок не был открыт, то открываем его
    if (!isOpen) {
      block.classList.add("open");
    } else {
      block.classList.remove("open");
    }
  });
});
