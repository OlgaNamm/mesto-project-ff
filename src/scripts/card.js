import { deleteCard, putLikeCard, deleteLikeCard } from "./api.js";
import { openModal, closeModal } from "./modal.js";

const cardTemplate = document.querySelector("#card-template").content;
const confirmPopup = document.querySelector(".popup_type_confirm");
const confirmForm = confirmPopup.querySelector(".popup__form");

function createCard(
  cardData,
  openImagePopup,
  handleLikeClick,
  profileId,
  updateLikesCount
) {
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);

  const cardImage = cardElement.querySelector(".card__image");
  const cardAlt = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const likeButton = cardElement.querySelector(".card__like-button");
  const deleteCardButton = cardElement.querySelector(".card__delete-button");

  const likesCounter = cardElement.querySelector(".card__likes-counter");

  cardImage.src = cardData.link;
  cardAlt.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  //проверка карточка чужая или моя
  if (cardData.owner._id === profileId) {
    deleteCardButton.classList.remove("card__delete-button_hidden");
  } else {
    deleteCardButton.classList.add("card__delete-button_hidden");
  }

  deleteCardButton.addEventListener("click", () => {
    openConfirmPopup(cardData._id, cardElement);
  });

  cardImage.addEventListener("click", () => {
    openImagePopup(cardData);
  });

  likeButton.addEventListener("click", () => {
    handleLikeClick(cardData, likeButton, likesCounter, profileId);
  });

  updateLikesCount(cardData.likes.length, likesCounter);

  return cardElement;
}

function openConfirmPopup(cardId, cardElement) {
  openModal(confirmPopup);
  confirmForm.addEventListener("submit", (evt) => {
    evt.preventDefault();
    handleDeleteCard(cardId, cardElement);
  });
}

function handleDeleteCard(cardId, cardElement) {
  deleteCard(cardId)
    .then(() => {
      cardElement.remove();
      closeModal(confirmPopup);
    })
    .catch((err) => {
      console.error("Ошибка при удалении карточки:", err);
    });
}

function updateLikesCount(count, likesCounter) {
  likesCounter.textContent = count;
}

function handleLikeClick(cardData, likeButton, likesCounter, profileId) {
  const cardId = cardData._id;
  const isLiked = cardData.likes.some((user) => user._id === profileId);

  const likePromise = isLiked ? deleteLikeCard(cardId) : putLikeCard(cardId);

  likePromise
    .then((updatedCard) => {
      // Обновляем состояние кнопки лайка
      likeButton.classList.toggle("card__like-button_is-active");
      // Обновляем счетчик лайков
      updateLikesCount(updatedCard.likes.length, likesCounter);
      // Обновляем данные о лайках в cardData
      cardData.likes = updatedCard.likes;
    })
    .catch((err) => {
      console.error("Ошибка при лайке/дизлайке карточки:", err);
    });
}

export { createCard, handleLikeClick, updateLikesCount };
