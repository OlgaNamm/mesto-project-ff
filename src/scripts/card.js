/// Темплейт карточки
const cardTemplate = document.querySelector("#card-template").content;

function createCard(cardData, deleteCard, openImagePopup, handleLikeClick) {
  //клонировать шаблон
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);

  //установить значения вложенных элементов
  const cardImage = cardElement.querySelector(".card__image");
  const cardAlt = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const likeButton = cardElement.querySelector(".card__like-button");
  const cardButton = cardElement.querySelector(".card__delete-button");

  cardImage.src = cardData.link;
  cardAlt.alt = cardData.alt;
  cardTitle.textContent = cardData.name;

  cardButton.addEventListener("click", () => deleteCard(cardElement));

  //слушатель клика на картинку для открытия попапа
  cardImage.addEventListener("click", () => {
    openImagePopup(cardData);
  });

  likeButton.addEventListener("click", () => {
    handleLikeClick(likeButton);
  });

  return cardElement;
}

function deleteCard(cardElement) {
  cardElement.remove();
}

function handleLikeClick(likeButton) {
  likeButton.classList.toggle("card__like-button_is-active");
}

export { createCard, deleteCard, handleLikeClick };
