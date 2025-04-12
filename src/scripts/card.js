import { deleteCard, putLikeCard, deleteLikeCard } from "./api.js";
import { closeModal } from "./modal.js";
import { confirmPopup } from "./index.js";

const cardTemplate = document.querySelector("#card-template").content;

function createCard(cardData, openImagePopup, profileId, handleDeleteClick) {
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
    deleteCardButton.addEventListener("click", () => {
      handleDeleteClick(cardData._id, cardElement);
    });
  } else {
    deleteCardButton.classList.add("card__delete-button_hidden");
  }

  cardImage.addEventListener("click", () => {
    openImagePopup(cardData);
  });

  likeButton.addEventListener("click", () => {
    handleLikeClick(cardData, likeButton, likesCounter, profileId);
  });

  updateLikesCount(cardData, likesCounter, likeButton, profileId);

  return cardElement;
}

function updateLikesCount(cardData, likesCounter, likeButton, profileId) {
  if (cardData && cardData.likes) {
    likesCounter.textContent = cardData.likes.length;
    const isLiked = cardData.likes.some((user) => user._id === profileId);
    if (isLiked) {
      likeButton.classList.add("card__like-button_is-active");
    } else {
      likeButton.classList.remove("card__like-button_is-active");
    }
  } else {
    console.error(
      "Ошибка: cardData или cardData.likes не определены в updateLikesCount"
    );
  }
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

function handleLikeClick(cardData, likeButton, likesCounter, profileId) {
  //проверка
  if (!cardData || !cardData.likes) {
    console.error("Ошибка: Некорректные данные карточки при лайке:", cardData);
    return;
  }

  const cardId = cardData._id;
  const isLiked = cardData.likes.some((user) => user._id === profileId);

  const likePromise = isLiked ? deleteLikeCard(cardId) : putLikeCard(cardId);

  likePromise
    .then((updatedCard) => {
      //проверка
      if (!updatedCard || !updatedCard.likes) {
        console.error(
          "Ошибка: Некорректный ответ сервера при лайке:",
          updatedCard
        );
        return;
      }
      // Обновляем счетчик лайков
      updateLikesCount(updatedCard, likesCounter, likeButton, profileId);
      // Обновляем данные о лайках в cardData
      cardData.likes = updatedCard.likes;
    })
    .catch((err) => {
      console.error("Ошибка при лайке/дизлайке карточки:", err);
    });
}

export { createCard, handleDeleteCard };
