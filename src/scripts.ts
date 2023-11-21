import axios from 'axios';
import { type } from 'jquery';
import formatDistance from 'date-fns/formatDistance';
import { parseISO } from 'date-fns';

const cardsWrapper = document.querySelector<HTMLDivElement>('.cards');

type Car = {
    id: number;
    img: string;
    brand: string;
    model: string;
    color: string;
    price: string;
    createdAt: string;
}

const carPics = ['bmw.png', 'volvo.png', 'audi.png', 'toyota.png', 'fiat.png', 'volkswagen.png', 'mercedes.png', 'ford.png'];

const drawCars = () => {
  cardsWrapper.innerHTML = '';

  axios.get<Car[]>('http://localhost:3004/cars').then(({ data }) => {
    data.forEach((car) => {
      // Time
      const result = formatDistance(parseISO(car.createdAt), new Date(), {
        addSuffix: true,
      });
      // Draw card
      cardsWrapper.innerHTML += `
      <div class="card-wrapper">
            <div class="card__img-wrapper">
                <img src="assets/images/${car.img}" class="card__img" alt="car">
            </div>
            <div class="card-info">
                <div class="card__title">${car.brand}</div>
                <div class="card__description">${car.model}</div>
                <div class="card__data">${car.color}</div>
                <div class="card__price">€${car.price}</div>
                <div class="card-buttons">
                    <button class="button-edit">Edit?</button>
                    <button class="button-delete" data-car-id="${car.id}">Delete</button>
                </div>
                <div class="card__timestamp">created ${result}</div>
            </div>
        </div>
        `;
    });

    const carDeleteButton = document.querySelectorAll<HTMLButtonElement>('.button-delete');

    carDeleteButton.forEach((carBtn) => {
      carBtn.addEventListener('click', () => {
        const { carId } = carBtn.dataset;
        axios.delete(`http://localhost:3004/cars/${carId}`).then(() => {
          drawCars();
        });
      });
    });
  });
};

drawCars();

const inputForm = document.querySelector('.input-form');

inputForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const carBrandInput = inputForm.querySelector<HTMLInputElement>('input[name="brand"]');
  const carBrandInputValue = carBrandInput.value;

  const carModelInput = inputForm.querySelector<HTMLInputElement>('input[name="model"]');
  const carModelInputValue = carModelInput.value;

  const carColorInput = inputForm.querySelector<HTMLInputElement>('input[name="color"]');
  const carColorInputValue = carColorInput.value;

  const carPriceInput = inputForm.querySelector<HTMLInputElement>('input[name="price"]');
  const carPriceInputValue = carPriceInput.value;

  axios.post<Car>('http://localhost:3004/cars', {
    brand: carBrandInputValue,
    model: carModelInputValue,
    color: carColorInputValue,
    price: carPriceInputValue,
    time: new Date(),
    img: carPics[Math.floor(Math.random() * carPics.length)],
  }).then(() => {
    carBrandInput.value = '';
    carModelInput.value = '';
    carColorInput.value = '';
    carPriceInput.value = '';
    drawCars();
  });
});

