import flatpickr from "flatpickr";
import throttle from 'lodash.throttle';
import "flatpickr/dist/flatpickr.min.css";

let usersTimeMs;
let diffTime;

const refs = {
    input: document.querySelector('input'),
    buttom: document.querySelector('button'),
    days: document.querySelector('span[data-days]'),
    hours: document.querySelector('span[data-hours]'),
    minutes: document.querySelector('span[data-minutes]'),
    seconds: document.querySelector('span[data-seconds]'),
};

const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        usersTimeMs = selectedDates[0].getTime();
        const defaultTime = (new Date()).getTime();
        diffTime = usersTimeMs - defaultTime;
        if(usersTimeMs <= defaultTime){ //доробити алерт
            alert("Please, choose a date in the future");
        } else {
            refs.buttom.removeAttribute('disabled');
        }
    },
};

refs.buttom.setAttribute('disabled', true);
flatpickr(refs.input, options);
refs.input.addEventListener('input', (event) => {
    options.onClose;
});

refs.buttom.addEventListener('click', () => {
    refs.buttom.setAttribute('disabled', true);
    const maxTime = convertMs(diffTime);
    refs.days.textContent = maxTime.days;
    
    refs.hours.textContent = maxTime.hours;
    refs.minutes.textContent = maxTime.minutes;
    refs.seconds.textContent = maxTime.seconds;
    throttle(refs.seconds.textContent => {
        return refs.seconds.textContent -= 1;
    }, 1000);
});

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}