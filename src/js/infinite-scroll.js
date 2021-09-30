import * as basicLightbox from 'basiclightbox';
import '../../node_modules/basiclightbox/dist/basicLightbox.min.css';

// import debounce from 'lodash.debounce'; // почему устанавливаю lodash.debounce а подключается только через 'lodash'?

import { alert, error, defaultModules } from '@pnotify/core/dist/PNotify.js';
import * as PNotifyMobile from '@pnotify/mobile/dist/PNotifyMobile.js';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
defaultModules.set(PNotifyMobile, {});

import LoadMoreBtn from './btn-loadMore.js';
const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});

import ApiService from './apiService.js';
const apiService = new ApiService();

import refs from './refs.js';
const { form, list } = refs;

import template from '../templates/template.hbs';
//------------------------------------------------------------------------------

// настройки
let options = {
  rootMargin: '150px',
  threshold: 0.5,
};
const observer = new IntersectionObserver(onEntry, options);

// функция обратного вызова
function onEntry(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      fetchPhotos();
      //   console.log(entry.target);
      //   observer.unobserve(entry.target);
      observer.observe(document.querySelector('.observer-container'));
    }
  });
}

// наблюдатель

//------------------------------------------------------------------------------
form.addEventListener('submit', onSearch);

function onSearch(e) {
  e.preventDefault();

  apiService.query = e.target.elements.search.value.trim();
  if (apiService.query === '' || apiService.query === ' ') {
    return alert({
      text: `Введите запрос`,
    });
  }

  apiService.resetPage();
  clearArticlesContainer();
  fetchPhotos();

  form.reset();
}

function createMarkUp(array) {
  const items = template(array);
  list.insertAdjacentHTML('beforeend', items);
}

async function fetchPhotos() {
  try {
    const articles = await apiService.fetchArticles();
    console.log(apiService.pageNumber);
    if (articles.total === 0) {
      error({
        text: `По Вашему запросу ничего не найдено`,
      });
    }

    if (articles.total <= 12 || articles.hits.length < 12) {
      loadMoreBtn.hide();
    }

    createMarkUp(articles.hits);
  } catch (error) {
    console.log(error);
  }
  observer.observe(document.querySelector('li:last-child'));
}

function clearArticlesContainer() {
  list.innerHTML = '';
}
