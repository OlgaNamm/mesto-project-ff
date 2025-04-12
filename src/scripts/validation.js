function enableValidation(config) {
  const forms = document.querySelectorAll(config.formSelector);
  forms.forEach((form) => {
    const inputs = form.querySelectorAll(config.inputSelector);
    const submitButton = form.querySelector(config.submitButtonSelector);

    inputs.forEach((input) => {
      input.addEventListener("input", () => {
        //функция проверки валидности полей формы
        isInputValid(form, input, config);
        toggleSubmitButton(inputs, submitButton, config.inactiveButtonClass);
      });
    });
    toggleSubmitButton(inputs, submitButton, config.inactiveButtonClass);
  });
}

//функция проверки валидности полей формы
function isInputValid(formElement, inputElement, config) {
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
      config
    );
  } else {
    hideInputError(formElement, inputElement, config);
  }
}

//функция показать ошибку
function showInputError(formElement, inputElement, errorMessage, config) {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.add(config.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(config.errorClass);
}

//функция скрыть ошибку
function hideInputError(formElement, inputElement, config) {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.remove(config.inputErrorClass);
  errorElement.textContent = "";
  errorElement.classList.remove(config.errorClass);
}

//функция переключения состояния кнопки
//если есть невалидное поле - добавляем класс неактивности
function toggleSubmitButton(inputs, submitButton, inactiveButtonClass) {
  const hasInvalidInput = Array.from(inputs).some(
    (input) => !input.validity.valid
  );

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

export { enableValidation, clearValidation };
