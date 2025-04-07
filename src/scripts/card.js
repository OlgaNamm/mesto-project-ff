import { deleteCard } from './api.js'; 
/// Темплейт карточки
const cardTemplate = document.querySelector("#card-template").content;

function createCard(cardData, openImagePopup, handleLikeClick, profileId) {
  //клонировать шаблон
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);

  //установить значения вложенных элементов
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

  //слушатель удаления карточки
  deleteCardButton.addEventListener("click", () =>
    handleDeleteCard(cardData._id, cardElement)
  );

  //слушатель клика на картинку для открытия попапа
  cardImage.addEventListener("click", () => {
    openImagePopup(cardData);
  });

  likeButton.addEventListener("click", () => {
    handleLikeClick(likeButton);
  });

  return cardElement;
}

function handleDeleteCard(cardId, cardElement) {
  deleteCard(cardId) // функция deleteCard из api.js
      .then(() => {
          cardElement.remove(); // удаляем карточку из DOM после удаления с сервера
      })
      .catch((err) => {
          console.error("Ошибка при удалении карточки:", err);
      });
}

function handleLikeClick(likeButton) {
  likeButton.classList.toggle("card__like-button_is-active");
}

/*function addCardToDOM(cardElement) {
  placesList.append(cardElement);
}
*/
export { createCard, handleLikeClick };
