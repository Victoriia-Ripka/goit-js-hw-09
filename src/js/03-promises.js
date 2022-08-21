import { Notify } from 'notiflix/build/notiflix-notify-aio';

Notify.init({
  width: '250px',
  position: 'right-top',
  useIcon: false,
  timeout: 5000,
});

const refs = {
  firstDelay: document.querySelector('input[name=delay]'),
  delayStep: document.querySelector('input[name=step]'),
  amount: document.querySelector('input[name=amount]'),
  submit: document.querySelector('form'),
};

const submitBtnHandler = e => {
  e.preventDefault();

  const amount = refs.amount.value;
  const firstDelay = Number(refs.firstDelay.value);
  const delayStep = Number(refs.delayStep.value);

  let position = 0;
  let delay = firstDelay - delayStep;

  for (let i = 1; i <= amount; i += 1) {
    position += 1;
    delay += delayStep;

    createPromise(position, delay)
      .then(({ position, delay }) => {
        Notify.success(`✅ Fulfilled promise ${position} in ${delay}ms`);
      })
      .catch(({ position, delay }) => {
        Notify.failure(`❌ Rejected promise ${position} in ${delay}ms`);
      });
  }

  refs.submit.reset();
};

refs.submit.addEventListener('submit', submitBtnHandler);

function createPromise(position, delay) {
  const shouldResolve = Math.random() > 0.3;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldResolve) {
        resolve({ position, delay });
      } else {
        reject({ position, delay });
      }
    }, delay);
  });
}