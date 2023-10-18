import axios from 'axios';
import { BASE_URL, options } from './pixabay-api';
import { lightbox } from './simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  searchForm: document.querySelector('.search-form'),
  galleryContainer: document.querySelector('.gallery'),
  loader: document.querySelector('.loader'),
  input: document.querySelector('.search-form__input'),
};

let totalHits = 0;
let isLoadingMore = false;
let reachedEnd = false;

refs.searchForm.addEventListener('submit', onSearch);
window.addEventListener('scroll', onScrollHandler);
document.addEventListener('DOMContentLoaded', hideLoader);

function showLoader() {
  refs.loader.style.display = 'block';
}
function hideLoader() {
  refs.loader.style.display = 'none';
}

function onRenderGallery(elements) {
  const markup = elements
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
    <a href="${largeImageURL}">
      <img class="photo-img" src="${webformatURL}" alt="${tags}" loading="lazy" />
    </a>
    <div class="info">
      <p class="info-item">
        <b>Likes</b>
        ${likes}
      </p>
      <p class="info-item">
        <b>Views</b>
        ${views}
      </p>
      <p class="info-item">
        <b>Comments</b>
        ${comments}
      </p>
      <p class="info-item">
        <b>Downloads</b>
        ${downloads}
      </p>
    </div>
    </div>`;
      }
    )
    .join('');
  refs.galleryContainer.insertAdjacentHTML('beforeend', markup);
  if (options.params.page * options.params.per_page >= totalHits) {
    if (!reachedEnd) {
      Notify.info("We're sorry, but you've reached the end of search results.");
      reachedEnd = true;
    }
  }
  lightbox.refresh();
}

async function loadMore() {
  isLoadingMore = true;
  options.params.page += 1;
  try {
    showLoader();
    const response = await axios.get(BASE_URL, options);
    const hits = response.data.hits;
    onRenderGallery(hits);
  } catch (err) {
    Notify.failure(err);
    hideLoader();
  } finally {
    hideLoader();
    isLoadingMore = false;
  }
}

function onScrollHandler() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  const scrollThreshold = 300;
  if (
    scrollTop + clientHeight >= scrollHeight - scrollThreshold &&
    refs.galleryContainer.innerHTML !== '' &&
    !isLoadingMore &&
    !reachedEnd
  ) {
    loadMore();
  }
}

async function onSearch(e) {
  e.preventDefault();
  options.params.q = refs.input.value.trim();
  if (options.params.q === '') {
    return;
  }
  options.params.page = 1;
  refs.galleryContainer.innerHTML = '';
  reachedEnd = false;

  try {
    showLoader();
    const response = await axios.get(BASE_URL, options);
    totalHits = response.data.totalHits;
    const hits = response.data.hits;
    if (hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      Notify.success(`Hooray! We found ${totalHits} images.`);
      onRenderGallery(hits);
    }
    refs.input.value = '';
    hideLoader();
  } catch (err) {
    Notify.failure(err);
    hideLoader();
  }
}
