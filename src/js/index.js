import '../css/index.css';
import PixabayApi from './pixabay-api';
import { lightbox } from './simplelightbox';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  searchForm: document.querySelector('.search-form'),
  galleryContainer: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};
let isShown = 0;
const pixabayApi = new PixabayApi();

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

const options = {
  rootMargin: '50px',
  root: null,
  threshold: 0.3,
};
const observer = new IntersectionObserver(onLoadMore, options);

function onSearch(element) {
  element.preventDefault();

  refs.galleryContainer.innerHTML = '';
  pixabayApi.query = element.currentTarget.elements.searchQuery.value.trim();
  pixabayApi.resetPage();

  if (pixabayApi.query === '') {
    Notify.warning('Please, fill the main field');
    return;
  }

  // isShown = 0;
  fetchGallery();
  onRenderGallery(hits);
}

function onLoadMore() {
  pixabayApi.incrementPage();
  fetchGallery();
}

async function fetchGallery() {
  refs.loadMoreBtn.classList.add('is-hidden');

  const result = await pixabayApi.fetchGallery();

  const { hits, totalHits, total } = result;

  isShown = hits.length;

  if (!hits.length) {
    Notify.failure(
      `Sorry, there are no images matching your search query. Please try again.`
    );
    refs.loadMoreBtn.classList.add('is-hidden');
    return;
  }

  if (isShown < totalHits) {
    Notify.success(`Hooray! We found ${totalHits} images !!!`);
    refs.loadMoreBtn.classList.remove('is-hidden');
  }

  onRenderGallery(hits);

  if (isShown >= totalHits) {
    Notify.info("We're sorry, but you've reached the end of search results.");
  }
  console.log(isShown);
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
  lightbox.refresh();
}
