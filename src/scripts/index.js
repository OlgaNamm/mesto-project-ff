import "core-js/stable";
import "regenerator-runtime/runtime";
import "../pages/index.css";
//import { initialCards } from "./cards.js";
import { createCard, handleLikeClick } from "./card.js";
import { openModal, closeModal } from "./modal.js";
import { enableValidation, clearValidation } from "./validation.js";
import {
  getInitialUsersInfo,
  getInitialCards,
  changeProfileData,
  postNewCard,
} from "./api.js";

const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error", //красная рамка
  errorClass: "popup__error_visible", //сообщение об ошибке
};

// DOM узлы
const placesList = document.querySelector(".places__list");
const allPopups = document.querySelectorAll(".popup");

const profileEditForm = document.forms["edit-profile"];
const addNewCardForm = document.forms["new-place"];

//информация о пользователе
const profileName = document.querySelector(".profile__title");
const profileJob = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__image");

//кнопки
const closeButtons = document.querySelectorAll(".popup__close");
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

let profileId;

enableValidation(validationConfig); //вкл валидацию всех форм

/*
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

// Функция добавления карточки в DOM
function addCardToPage(cardElement) {
  placesList.prepend(cardElement); // Добавляем в начало списка
}
*/

function addCardToDOM(cardElement) {
  placesList.append(cardElement);
}

//функция открытие попапа карточки
function openImagePopup(cardData) {
  popupImageContent.src = cardData.link;
  popupImageContent.alt = cardData.alt;
  popupImageCaption.textContent = cardData.name;
  openModal(imagePopup);
}

closeButtons.forEach((button) => {
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
closeButtons.forEach((button) => {
  const popup = button.closest(".popup"); // конкретный попап
  button.addEventListener("click", () => {
    closeModal(popup); // закрываем этот конкретный попап
  });
});

// слушатель кнопка добавления карточки
addButton.addEventListener("click", function () {
  clearValidation(addNewCardForm, validationConfig);
  openModal(addPopup);
});

// функция отправки формы создания новой карточки
function handleAddFormSubmit(evt) {
  evt.preventDefault();
  const newCardName = cardNameInput.value; // присвоили
  const newCardLink = cardUrlInput.value; // присвоили

  postNewCard({
    // отправка данных на сервер
    name: newCardName,
    link: newCardLink,
  })
    .then((newCardData) => {
      const card = createCard(
        newCardData,
        openImagePopup,
        handleLikeClick,
        profileId
      );
      addCardToDOM(card);
      closeModal(addPopup);
      addFormElement.reset();
    })
    .catch((err) => {
      console.error("Ошибка при добавлении карточки:", err);
    });
}

// слушатель к форме создания новой карточки
addFormElement.addEventListener("submit", handleAddFormSubmit);

function setUserInfo(userData) {
  profileName.textContent = userData.name;
  profileJob.textContent = userData.about;
  profileAvatar.src = userData.avatar;
  profileAvatar.alt = userData.name;
}

// слушатель кнопка редактирования профиля
editButton.addEventListener("click", function () {
  clearValidation(profileEditForm, validationConfig);
  nameInput.value = profileName.textContent;
  jobInput.value = profileJob.textContent;
  openModal(editPopup);
});

// функция отправки формы редактирования профиля
function handleEditFormSubmit(evt) {
  evt.preventDefault();
  const newName = nameInput.value;
  const newAbout = jobInput.value;
  //console.log("Новые данные:", newName, newAbout);
  changeProfileData({
    name: newName,
    about: newAbout,
  })
    .then((updatedUserData) => {
      //console.log("Данные, полученные с сервера:", updatedUserData);
      setUserInfo(updatedUserData); // Обновляем информацию на странице
      closeModal(editPopup);
    })
    .catch((err) => {
      console.error("Ошибка при обновлении профиля:", err);
    });
}

// слушатель к форме редактировать профиль
editFormElement.addEventListener("submit", handleEditFormSubmit);

//Promis.all для загрузки данных
Promise.all([getInitialUsersInfo(), getInitialCards()])
  .then(([userData, cards]) => {
    const profileId = userData._id; // ID пользователя
    //обновить данные на странице
    setUserInfo(userData);
    cards.forEach((cardData) => {
      const card = createCard(
        cardData,
        openImagePopup,
        handleLikeClick,
        profileId
      );
      addCardToDOM(card);
    });
  })
  .catch((err) => {
    console.error("Ошибка при загрузке данных:", err);
  });

// функция лоадера
// нужно сделать лоадер в разметке + стили
