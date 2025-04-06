// Токен: 102b5c18-223e-4b83-9187-f1ea86749eb2
// Идентификатор группы: wff-cohort-35

/*
1. Загрузить данные с сервера.
2. Выводим данные на страницу. 
3. Все изменения на странице передаём на сервер. 
4. Обновляем страницу  с новыми данными.
*/

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

  
export const getInitialCards = () => {
  return fetch(`${config.baseUrl}/cards`, {
    headers: config.headers,
  }).then(handleResponse);
};
