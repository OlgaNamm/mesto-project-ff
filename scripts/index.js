// @todo: Темплейт карточки

const cardTemplate = document.querySelector('#card-template').content;

// @todo: DOM узлы

const placesList = document.querySelector('.places__list'); // куда выводим карточки

// @todo: Функция создания карточки

function createCard(cardData, deleteCard) {

    //клонировать шаблон
    const cardElement = cardTemplate.querySelector('.card').cloneNode(true);

    //установить значения вложенных элементов
    const cardImage = cardElement.querySelector('.card__image');
    const cardAlt = cardElement.querySelector('.card__image');
    const cardTitle = cardElement.querySelector('.card__title');
    cardImage.src = cardData.link;
    cardAlt.alt = cardData.alt;
    cardTitle.textContent = cardData.name;

    //добавить к иконке удаления обработчик клика, по которому будет вызван переданный в аргументах колбэк
    const cardButton = cardElement.querySelector('.card__delete-button');
    cardButton.addEventListener('click', () => deleteCard(cardElement));

    return cardElement;
};

// @todo: Функция удаления карточки

function deleteCard(cardElement) {
    cardElement.remove();
};

// @todo: Вывести карточки на страницу

initialCards.forEach((cardData) => {
    const card = createCard(cardData, deleteCard);
    placesList.append(card);
});
