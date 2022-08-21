// Описаний в документації
import flatpickr from 'flatpickr';
// Додатковий імпорт стилів
import 'flatpickr/dist/flatpickr.min.css';

import { Notify } from 'notiflix/build/notiflix-notify-aio';

// refs
const refs = {
  input: document.querySelector('input'),
  start: document.querySelector('button[data-start]'),
  days: document.querySelector('span[data-days]'),
  hours: document.querySelector('span[data-hours]'),
  minutes: document.querySelector('span[data-minutes]'),
  seconds: document.querySelector('span[data-seconds]'),
};

let timerId = null;

Notify.init({
  width: '300px',
  position: 'center-top',
  closeButton: true,
  clickToClose: true,
});

// options for flatpickr
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    const deltaTimeForPlchdr = selectedDate - new Date();
    alertOnPastTime(deltaTimeForPlchdr);
    disableBtnStart(deltaTimeForPlchdr);
    enableBtnStart(deltaTimeForPlchdr);
    const timeLeftForPlchdr = convertMs(deltaTimeForPlchdr);
    render(timeLeftForPlchdr, deltaTimeForPlchdr);

    // Обробник кліку по кнопці старт
    const startBtnClickHandler = () => {
      timerId = setInterval(updateTimer, 1000);
    };

    function updateTimer() {
      const timeNow = new Date();
      const deltaTime = selectedDate - timeNow;
      const timeLeft = convertMs(deltaTime);
      render(timeLeft, deltaTime);
    }
    // ==========EventListener==============
    refs.start.addEventListener('click', startBtnClickHandler);
  },
};

flatpickr(refs.input, options);

// Функція, щоб відключити кнопку Старт
const disableBtnStart = time => {
  if (time < 0) {
    refs.start.setAttribute('disabled', 'disabled');
  }
};

// Функція, щоб включити кнопку Старт
const enableBtnStart = time => {
  if (time > 0) {
    refs.start.removeAttribute('disabled');
  }
};

// Створюю функцію, щоб обробляти подію коли користувач обере минулий час
const alertOnPastTime = time => {
  if (time < 0) {
    return Notify.warning('Please choose a date in the future');
  }
};

// Створюю функцію, щоб додавати 0 коли число складається з однієї цифри
function addLeadingZero(value) {
  return value.toString().length < 2
    ? value.toString().padStart(2, '0')
    : value;
}

// Функцію для концертуванна мілісекунд в час
function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);
  return { days, hours, minutes, seconds };
}

const render = ({ days, hours, minutes, seconds }, deltaTime) => {
  if (deltaTime > 0) {
    refs.days.textContent = addLeadingZero(days);
    refs.hours.textContent = addLeadingZero(hours);
    refs.minutes.textContent = addLeadingZero(minutes);
    refs.seconds.textContent = addLeadingZero(seconds);
  } else {
    refs.days.textContent = addLeadingZero(0);
    refs.hours.textContent = addLeadingZero(0);
    refs.minutes.textContent = addLeadingZero(0);
    refs.seconds.textContent = addLeadingZero(0);
  }
};