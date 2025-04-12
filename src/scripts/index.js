import "../pages/index.css";
import { createCard, handleDeleteCard } from "./card.js";
import { openModal, closeModal } from "./modal.js";
import { enableValidation, clearValidation } from "./validation.js";
import {
  getInitialUsersInfo,
  getInitialCards,
  changeProfileData,
  postNewCard,
  changeProfileImage,
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
export const confirmPopup = document.querySelector(".popup_type_confirm");

// формы
const profileEditForm = document.forms["edit-profile"];
const addNewCardForm = document.forms["new-place"];
const avatarForm = document.forms["update-avatar"];
const confirmForm = document.forms["confirm-delete"];

//информация о пользователе
const profileName = document.querySelector(".profile__title");
const profileJob = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__image");

//кнопки
const closeButtons = document.querySelectorAll(".popup__close");
const editButton = document.querySelector(".profile__edit-button");
const addButton = document.querySelector(".profile__add-button");
const avatarButton = document.querySelector(".profile__edit-avatar-button");

// попап редактирования аватара
const avatarPopup = document.querySelector(".popup_type_avatar");
const avatarLinkInput = avatarForm.querySelector(".popup__input_type_url");

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

function addCardToDOM(cardData) {
  placesList.append(cardData);
}

function prependCardToDOM(cardData) {
  const card = createCard(
    cardData,
    openImagePopup,
    profileId,
    openConfirmPopup
  );
  placesList.prepend(card);
}


function openConfirmPopup(cardId, cardElement) {
  openModal(confirmPopup);
  function clickHandler(evt) {
    evt.preventDefault();
    handleDeleteCard(cardId, cardElement);
    confirmForm.onclick = null; //удаляет слушатель после клика
  }
  confirmForm.onclick = clickHandler; //перезаписывает обработчик
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

addButton.addEventListener("click", function () {
  clearValidation(addNewCardForm, validationConfig);
  openModal(addPopup);
});

editButton.addEventListener("click", function () {
  clearValidation(profileEditForm, validationConfig);
  nameInput.value = profileName.textContent;
  jobInput.value = profileJob.textContent;
  openModal(editPopup);
});

avatarButton.addEventListener("click", () => {
  clearValidation(avatarForm, validationConfig);
  avatarLinkInput.value = profileAvatar.src;
  const button = avatarForm.querySelector(
    validationConfig.submitButtonSelector
  );
  renderLoading(false, button);
  openModal(avatarPopup);
});

addForm.addEventListener("submit", handleAddFormSubmit);

editForm.addEventListener("submit", handleEditFormSubmit);

avatarForm.addEventListener("submit", handleAvatarFormSubmit);

// открытие попапа карточки
function openImagePopup(cardData) {
  popupImageContent.src = cardData.link;
  popupImageContent.alt = cardData.alt;
  popupImageCaption.textContent = cardData.name;
  openModal(imagePopup);
}

// изменения текста кнопки submit
function renderLoading(
  isLoading, // булево значение
  button, // конкретная кнопка
  buttonText = "Сохранить",
  loadingText = "Сохранение..."
) {
  button.textContent = isLoading ? loadingText : buttonText;
}

// АВАТАРКА

function updateAvatar(avatarLink) {
  profileAvatar.src = avatarLink;
}

function setUserInfo(userData) {
  profileName.textContent = userData.name;
  profileJob.textContent = userData.about;
  updateAvatar(userData.avatar);
}

function handleAvatarFormSubmit(evt) {
  evt.preventDefault();
  const button = avatarForm.querySelector(
    validationConfig.submitButtonSelector
  );
  renderLoading(true, button);

  const avatarLink = avatarLinkInput.value;
  changeProfileImage(avatarLink)
    .then((userData) => {
      // получить данные пользователя из ответа сервера
      updateAvatar(userData.avatar); // берем аватар из ответа
      setUserInfo(userData); // обновляем
      closeModal(avatarPopup);
    })
    .catch((err) => {
      console.error("Ошибка при обновлении аватара:", err);
      err
        .json()
        .then((errorMessage) => {
          console.error("Сообщение об ошибке от сервера:", errorMessage);
        })
        .catch(() => {
          console.error("Не удалось получить сообщение об ошибке от сервера");
        })
        .finally(() => {
          renderLoading(false, button);
        });
    });
}

// СОЗДАНИЕ НОВОЙ КАРТОЧКИ

function handleAddFormSubmit(evt) {
  evt.preventDefault();
  const button = addForm.querySelector(validationConfig.submitButtonSelector);
  renderLoading(true, button);

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
    })
    .finally(() => {
      renderLoading(false, button);
    });
}

// РЕДАКТИРОВАНИЕ ИНФОРМАЦИИ ПОЛЬЗОВАТЕЛЯ

function handleEditFormSubmit(evt) {
  evt.preventDefault();
  const button = editForm.querySelector(validationConfig.submitButtonSelector);
  renderLoading(true, button); // Меняем текст кнопки

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
    })
    .finally(() => {
      renderLoading(false, button); // Возвращаем исходный текст кнопки
    });
}

Promise.all([getInitialUsersInfo(), getInitialCards()])
  .then(([userData, cards]) => {
    profileId = userData._id; // ID пользователя
    //обновить данные на странице
    setUserInfo(userData);
    cards.forEach((cardData) => {
      const card = createCard(
        cardData,
        openImagePopup,
        profileId,
        openConfirmPopup
      );
      addCardToDOM(card);
    });
  })
  .catch((err) => {
    console.error("Ошибка при загрузке данных:", err);
  });
