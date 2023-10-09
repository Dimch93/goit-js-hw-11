import { fetchBreeds, fetchCatByBreed } from './pixabay-api';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.querySelector('.search-form'),
  btnSabmit: document.querySelector('.btn-submit'),
  btnLoad: document.querySelector('.load-more'),
};

const { form, btnSabmit, btnLoad } = refs;

form.addEventListener('submit', handleSearch);

async function handleSearch(event) {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);

  const countries = formData.map(el => el.trim()).filter(el => el);
  console.log(countries);
  try {
    const capitals = await serviceCountries(countries);
    const weather = await serviceWeather(capitals);

    refs.weatherList.innerHTML = createMarkup(weather);
  } catch (err) {
    console.log(err);
  } finally {
    refs.form.reset();
  }
}
