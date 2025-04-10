const config = {
  baseUrl: "https://nomoreparties.co/v1/wff-cohort-35",
  headers: {
    authorization: "102b5c18-223e-4b83-9187-f1ea86749eb2",
    "Content-Type": "application/json",
  },
};

const handleResponse = (res) => {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Ошибка: ${res.status}`);
};

// GET информация о пользователе
export const getInitialUsersInfo = () => {
  return fetch(`${config.baseUrl}/users/me`, {
    headers: config.headers,
  }).then(handleResponse);
};

// GET карточки
export const getInitialCards = () => {
  return fetch(`${config.baseUrl}/cards`, {
    headers: config.headers,
  }).then(handleResponse);
};

//PATCH обновление информации о пользователе
export const changeProfileData = (newProfileData) => {
  return fetch(`${config.baseUrl}/users/me`, {
    method: "PATCH",
    headers: config.headers,
    body: JSON.stringify(newProfileData),
  }).then(handleResponse);
};

// POST добавить новую карточку
export const postNewCard = (newCardData) => {
  return fetch(`${config.baseUrl}/cards`, {
    method: "POST",
    headers: config.headers,
    body: JSON.stringify(newCardData),
  }).then(handleResponse);
};

// удаление карточки
export const deleteCard = (cardId) => {
  return fetch(`${config.baseUrl}/cards/${cardId}`, {
    method: "DELETE",
    headers: config.headers,
  }).then(handleResponse);
};

// Постановка лайка (PUT-запрос)
export const putLikeCard = (cardId) => {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: "PUT",
    headers: config.headers,
  }).then(handleResponse);
};

// Снятие лайка (DELETE-запрос)
export const deleteLikeCard = (cardId) => {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: "DELETE",
    headers: config.headers,
  }).then(handleResponse);
};

//Обновление аватара пользователя (PATCH-запрос) СДЕЛАТЬ!!!
export const changeProfileImage = (newAvatar) => {
  return fetch(`${config.baseUrl}/users/me/avatar`, {
    method: "PATCH",
    headers: config.headers,
    body: JSON.stringify(newAvatar),
  }).then(handleResponse);
};

/*
СДЕЛАТЬ:
1. иконка + редактирование аватара
2. новый попап с формой - ссылка на картинку аватара (required type='url')
3. текст на submit «Сохранение...»

Дополнительно:
Попап удаления карточки?
*/
