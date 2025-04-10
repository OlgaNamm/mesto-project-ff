import "core-js/stable";
import "regenerator-runtime/runtime";
import "../pages/index.css";
//import { initialCards } from "./cards.js";
import { createCard, handleLikeClick, updateLikesCount } from "./card.js";
import { openModal, closeModal } from "./modal.js";
import { enableValidation, clearValidation } from "./validation.js";
import {
  getInitialUsersInfo,
  getInitialCards,
  changeProfileData,
  postNewCard,
  changeProfileImage
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

// формы
const profileEditForm = document.forms["edit-profile"];
const addNewCardForm = document.forms["new-place"];
const avatarForm = document.forms["update-avatar"];

//информация о пользователе
const profileName = document.querySelector(".profile__title");
const profileJob = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__image");
//const profileImageContainer = document.querySelector(".profile__image-container");

//кнопки
const closeButtons = document.querySelectorAll(".popup__close");
const editButton = document.querySelector(".profile__edit-button");
const addButton = document.querySelector(".profile__add-button");
const avatarButton = document.querySelector(".profile__edit-avatar-button");

// попап редактирования аватара
const avatarPopup = document.querySelector(".popup_type_avatar");
const avatarLinkInput = avatarForm.querySelector(".popup__input_type_url");
// const submitAvatarButton = document.querySelector("#avatar-submit-button");

//попап редактирования профиля
const editPopup = document.querySelector(".popup_type_edit");
// input внутри попапа редактирования профиля, единственный нужный элемент
const nameInput = editPopup.querySelector(".popup__input_type_name");
const jobInput = editPopup.querySelector(".popup__input_type_description");
const editForm = editPopup.querySelector(".popup__form");

//попап добавления карточки
const addPopup = document.querySelector(".popup_type_new-card");
// input внутри попапа добавления карточки, единственный нужный элемент
const cardNameInput = addPopup.querySelector(".popup__input_type_card-name");
const cardUrlInput = addPopup.querySelector(".popup__input_type_url");
const addForm = addPopup.querySelector(".popup__form");

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

// СЛУШАТЕЛИ

// слушатель кнопка добавления карточки
addButton.addEventListener("click", function () {
  clearValidation(addNewCardForm, validationConfig);
  openModal(addPopup);
});

// слушатель кнопка редактирования профиля
editButton.addEventListener("click", function () {
  clearValidation(profileEditForm, validationConfig);
  nameInput.value = profileName.textContent;
  jobInput.value = profileJob.textContent;
  openModal(editPopup);
});

// слушатель кнопка редактирования аватара
avatarButton.addEventListener("click", () => {
  clearValidation(avatarForm, validationConfig);
  avatarLinkInput.value = profileAvatar.src;
  openModal(avatarPopup);
});

// слушатель к форме создания новой карточки
addForm.addEventListener("submit", handleAddFormSubmit);

// слушатель к форме редактировать профиль
editForm.addEventListener("submit", handleEditFormSubmit);

// слушатель к форме редактирования аватара
avatarForm.addEventListener("submit", handleAvatarFormSubmit);

function addCardToDOM(CardData) {
  placesList.append(CardData);
}

function prependCardToDOM(CardData) {
  const card = createCard(
    CardData,
    openImagePopup,
    handleLikeClick,
    profileId,
    updateLikesCount
  );
  placesList.prepend(card);
}

const updateAvatar = (avatarLink) => {
  //console.log("Новая ссылка на аватар:", avatarLink); 
  profileAvatar.style.backgroundImage = `url(${avatarLink})`;
  //console.log("Текущий background аватара:", profileAvatar.style.backgroundImage);
};

function handleAvatarFormSubmit(evt) {
  evt.preventDefault();
  const avatarLink = avatarLinkInput.value;

  //console.log("Отправляемый URL:", avatarLink);
  //console.log("Тело запроса:", JSON.stringify({ avatar: avatarLink }));

  changeProfileImage(avatarLink)
  .then(() => {
    updateAvatar(avatarLink);
    closeModal(avatarPopup);
  })
  .catch((err) => {
    console.error("Ошибка при обновлении аватара:", err);
    err.json().then(errorMessage => {
      console.error("Сообщение об ошибке от сервера:", errorMessage);
    }).catch(() => {
      console.error("Не удалось получить сообщение об ошибке от сервера");
    });
})
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
      prependCardToDOM(newCardData);
      closeModal(addPopup);
      addForm.reset();
    })
    .catch((err) => {
      console.error("Ошибка при добавлении карточки:", err);
    });
}

function setUserInfo(userData) {
  profileName.textContent = userData.name;
  profileJob.textContent = userData.about;
  profileAvatar.src = userData.avatar;
  profileAvatar.alt = userData.name;
}

// функция отправки формы редактирования профиля
function handleEditFormSubmit(evt) {
  evt.preventDefault();
  const newName = nameInput.value;
  const newAbout = jobInput.value;
  changeProfileData({
    name: newName,
    about: newAbout,
  })
    .then((updatedUserData) => {
      setUserInfo(updatedUserData); // Обновляем информацию на странице
      closeModal(editPopup);
    })
    .catch((err) => {
      console.error("Ошибка при обновлении профиля:", err);
    });
}

//Promis.all для загрузки данных
Promise.all([getInitialUsersInfo(), getInitialCards()])
  .then(([userData, cards]) => {
    profileId = userData._id; // ID пользователя
    //обновить данные на странице
    setUserInfo(userData);
    cards.forEach((cardData) => {
      const card = createCard(
        cardData,
        openImagePopup,
        handleLikeClick,
        profileId,
        updateLikesCount
      );
      addCardToDOM(card);
    });
  })
  .catch((err) => {
    console.error("Ошибка при загрузке данных:", err);
  });

// функция лоадера
// нужно сделать лоадер в разметке + стили
