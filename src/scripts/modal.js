function openModal(modal) {
  modal.classList.add("popup_is-animated");
  setTimeout(() => {
    modal.classList.add("popup_is-opened"); // задержка + добавить класс открытия попапа
  }, 10);
  //добавить слушатель на Escape
  document.addEventListener("keydown", closeByEscape);
}

function closeModal(modal) {
  modal.classList.remove("popup_is-opened"); // удалить класс открытия попапа
  setTimeout(() => {
    modal.classList.remove("popup_is-animated");
  }, 300);
  //удалить слушатель на Escape
  document.removeEventListener("keydown", closeByEscape);
}

function closeByEscape(evt) {
  if (evt.key === "Escape") {
    const openedPopup = document.querySelector(".popup_is-opened");
    closeModal(openedPopup);
  }
}

export { openModal, closeModal, closeByEscape };
