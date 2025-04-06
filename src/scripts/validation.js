const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error", //красная рамка
  errorClass: "popup__error_visible", //сообщение об ошибке
};

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
function showInputError(
  formElement,
  inputElement,
  errorMessage,
  validationConfig
) {
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

// очищает ошибки валидации формы и делает кнопку неактивной
function clearValidation(formElement, config) {
  const inputs = Array.from(formElement.querySelectorAll(config.inputSelector));
  const submitButton = formElement.querySelector(config.submitButtonSelector);

  inputs.forEach((input) => {
    hideInputError(formElement, input, config);
  });

  toggleSubmitButton(inputs, submitButton, config.inactiveButtonClass);
}

export { validationConfig, enableValidation, clearValidation };
