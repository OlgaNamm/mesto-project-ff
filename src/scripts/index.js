import "../pages/index.css";
import { initialCards } from "./cards.js";
import { createCard, deleteCard, handleLikeClick } from "./card.js";
import { openModal, closeModal, closeByEscape } from "./modal.js";

// DOM узлы
const placesList = document.querySelector(".places__list");
const allPopups = document.querySelectorAll(".popup");
const closeByButton = document.querySelectorAll(".popup__close");

//информация о пользователе
const profileName = document.querySelector(".profile__title");
const profileJob = document.querySelector(".profile__description");

const editButton = document.querySelector(".profile__edit-button");
const addButton = document.querySelector(".profile__add-button");

//попап редактирования профиля
const editPopup = document.querySelector(".popup_type_edit");
// input внутри попапа редактирования профиля, единственный нужный элемент
const nameInput = editPopup.querySelector(".popup__input_type_name");
const jobInput = editPopup.querySelector(".popup__input_type_description");
const editFormElement = editPopup.querySelector(".popup__form");

//попап добавления карточки
const addPopup = document.querySelector(".popup_type_new-card");
// input внутри попапа добавления карточки, единственный нужный элемент
const cardNameInput = addPopup.querySelector(".popup__input_type_card-name");
const cardUrlInput = addPopup.querySelector(".popup__input_type_url");
const addFormElement = addPopup.querySelector(".popup__form");

//попап карточки
const imagePopup = document.querySelector(".popup_type_image");
const popupImageContent = imagePopup.querySelector(".popup__image");
const popupImageCaption = imagePopup.querySelector(".popup__caption");

// Вывести карточки на страницу
initialCards.forEach((cardData) => {
  const card = createCard(
    cardData,
    deleteCard,
    openImagePopup,
    handleLikeClick
  );
  placesList.append(card);
});

//функция открытие попапа карточки
function openImagePopup(cardData) {
  popupImageContent.src = cardData.link;
  popupImageContent.alt = cardData.alt;
  popupImageCaption.textContent = cardData.name;
  openModal(imagePopup);
}

closeByButton.forEach((button) => {
  const popup = button.closest(".popup"); // конкретный попап
  button.addEventListener("click", () => {
    closeModal(popup); // закрываем этот конкретный попап
  });
});

allPopups.forEach((overlay) => {
  overlay.addEventListener("click", (evt) => {
    if (evt.target === overlay) {
      closeModal(overlay);
    }
  });
});

// закрытие попапов на крестик
closeByButton.forEach((button) => {
  const popup = button.closest(".popup"); // конкретный попап
  button.addEventListener("click", () => {
    closeModal(popup); // закрываем этот конкретный попап
  });
});

// Функция добавления карточки в DOM
function addCardToPage(cardElement) {
  placesList.prepend(cardElement); // Добавляем в начало списка
}

// слушатель кнопка добавления карточки
addButton.addEventListener("click", function () {
  openModal(addPopup);
});

// функция отправки формы создания новой карточки
function handleAddFormSubmit(evt) {
  evt.preventDefault();
  const cardName = cardNameInput.value; // присвоили
  const cardLink = cardUrlInput.value; // присвоили
  const newCardData = {
    // положили
    name: cardName,
    link: cardLink,
    alt: cardName,
  };
  //создали новую карточку
  const newCard = createCard(
    newCardData,
    deleteCard,
    openImagePopup,
    handleLikeClick
  );
  addCardToPage(newCard); // добавили на страницу
  closeModal(addPopup);
  // очистили поля формы после добавления
  addFormElement.reset();
}

// слушатель к форме создания новой карточки
addFormElement.addEventListener("submit", handleAddFormSubmit);

// слушатель кнопка редактирования профиля
editButton.addEventListener("click", function () {
  nameInput.value = profileName.textContent;
  jobInput.value = profileJob.textContent;
  openModal(editPopup);
});

// функция отправки формы редактирования профиля
function handleFormSubmit(evt) {
  evt.preventDefault();
  const newName = nameInput.value;
  const newJob = jobInput.value;
  profileName.textContent = newName;
  profileJob.textContent = newJob;
  closeModal(editPopup);
}

// слушатель к форме редактировать профиль
editFormElement.addEventListener("submit", handleFormSubmit);
