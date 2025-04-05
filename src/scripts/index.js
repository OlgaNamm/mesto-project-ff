import "core-js/stable";
import "regenerator-runtime/runtime";
import "../pages/index.css";
import { initialCards } from "./cards.js";
import { createCard, deleteCard, handleLikeClick } from "./card.js";
import { openModal, closeModal } from "./modal.js";

// DOM узлы
const placesList = document.querySelector(".places__list");
const allPopups = document.querySelectorAll(".popup");

// Формы
const formElement = document.querySelector(".popup__form");
const formInput = formElement.querySelector(".form__input");

//информация о пользователе
const profileName = document.querySelector(".profile__title");
const profileJob = document.querySelector(".profile__description");

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
function handleEditFormSubmit(evt) {
  evt.preventDefault();
  const newName = nameInput.value;
  const newJob = jobInput.value;
  profileName.textContent = newName;
  profileJob.textContent = newJob;
  closeModal(editPopup);
}

// слушатель к форме редактировать профиль
editFormElement.addEventListener("submit", handleEditFormSubmit);

const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error", //красная рамка
  errorClass: "popup__error_visible", //сообщение об ошибке
};

enableValidation(validationConfig); //вкл валидацию всех форм

function enableValidation(config) {
  const forms = document.querySelectorAll(config.formSelector);
  forms.forEach((form) => {
    const inputs = form.querySelectorAll(config.inputSelector);
    const submitButton = form.querySelector(config.submitButtonSelector);

    inputs.forEach((input) => {
      input.addEventListener("input", () => {
        //функция проверки валидности полей формы
        //isInputValid(form, input, config.inputErrorClass, config.errorClass);
        isInputValid(form, input, validationConfig);
        //функция переключения состояния кнопки
        toggleSubmitButton(inputs, submitButton, config.inactiveButtonClass);
      });
    });
    //функция переключения состояния кнопки
    toggleSubmitButton(inputs, submitButton, config.inactiveButtonClass);
  });
}

//функция проверки валидности полей формы
function isInputValid(formElement, inputElement, validationConfig) {
  if (inputElement.validity.patternMismatch) {
    inputElement.setCustomValidity(inputElement.dataset.errorMessage);
  } else {
    inputElement.setCustomValidity("");
  }

  if (!inputElement.validity.valid) {
    showInputError(
      formElement,
      inputElement,
      inputElement.validationMessage,
      validationConfig
    );
  } else {
    hideInputError(formElement, inputElement, validationConfig);
  }
}

//функция показать ошибку
function showInputError(formElement, inputElement, errorMessage, validationConfig) {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.add(validationConfig.inputErrorClass);

  if (inputElement.type === "url" && !inputElement.validity.valid) {
    if (inputElement.validity.typeMismatch) {
      errorElement.textContent = "Введите корректный URL-адрес.";
    } else {
      errorElement.textContent = errorMessage; // Или используем стандартное сообщение, если другая ошибка
    }
  } else {
    // В противном случае выводим переданное сообщение об ошибке.
    errorElement.textContent = errorMessage;
  }

  errorElement.classList.add(validationConfig.errorClass);
}

//функция скрыть ошибку
function hideInputError(formElement, inputElement, validationConfig) {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.remove(validationConfig.inputErrorClass);
  errorElement.textContent = "";
  errorElement.classList.remove(validationConfig.errorClass);
}

//функция переключения состояния кнопки
//если есть невалидное поле - добавляем класс неактивности
function toggleSubmitButton(inputs, submitButton, inactiveButtonClass) {
  let hasInvalidInput = false; // все поля валидны
  for (const input of inputs) {
    if (!input.validity.valid) {
      hasInvalidInput = true; // есть невалидное поле
      break;
    }
  }

  if (hasInvalidInput) {
    submitButton.classList.add(inactiveButtonClass);
    submitButton.disabled = true;
  } else {
    submitButton.classList.remove(inactiveButtonClass);
    submitButton.disabled = false;
  }
}

//function clearValidation(popup, validationConfig) {}
