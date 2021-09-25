import * as basicLightbox from 'basiclightbox';

import * as _ from 'lodash'; // почему устанавливаю lodash.debounce а подключается только через 'lodash'?

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

//Для того чтобы корректно работал плавный скролл необходимо
//  зафиксировать высоту карточки.

// Отправляем запрос по submit (кнопка подойдет прекрасно)

// Кнопку "Load more" не нужно показывать когда картинок меньше или 12,
//  а также когда картинки закончились

// Запрос не должен отправляться при при пустой строке ввода
// (или если просто использует пробел)

// Будет прекрасно, если немного добавите оформления
// - это всё - таки финальная работа.Да и вёрстку пора вспоминать
//  накануне финального проекта

form.addEventListener('submit', onSearch);

loadMoreBtn.refs.button.addEventListener('click', fetchPhotos);

// const element = document.getElementById('.my-element-selector');
// element.scrollIntoView({
//   behavior: 'smooth',
//   block: 'end',
// });

// loadMoreBtn.refs.button.addEventListener('click', () => {
//   window.scrollTo({
//     top: document.documentElement.offsetHeight,
//     behavior: 'smooth',
//   });
// });

async function onSearch(e) {
  e.preventDefault();

  apiService.query = e.target.elements.search.value;
  if (apiService.query === '' || apiService.query === ' ') {
    return alert({
      text: `Введите запрос`,
    });
  }

  loadMoreBtn.show();
  apiService.resetPage();
  clearArticlesContainer();

  fetchPhotos();
}

async function createMarkUp(array) {
  const items = template(array);
  list.insertAdjacentHTML('beforeend', items);
}

async function fetchPhotos() {
  loadMoreBtn.disable();
  try {
    const articles = await apiService.fetchArticles();

    if (articles.total === 0) {
      error({
        text: `По Вашему запросу ничего не найдено`,
      });
    }

    if (articles.total <= 12 || articles.hits.length < 12) {
      loadMoreBtn.hide();
    }

    createMarkUp(articles.hits);
    loadMoreBtn.enable();
  } catch (error) {
    console.log(error);
  }
}

function clearArticlesContainer() {
  list.innerHTML = '';
}

const instance = basicLightbox.create(`
    <img src="#" width="800" height="600">
`);

list.addEventListener('click', openModal);
let currentImg;

function openModal(e) {
  currentImg = e.target;
  if (currentImg.nodeName === 'IMG') {
    e.preventDefault();
    const url = currentImg.dataset.source;
    console.log(url);
    instance.show();
    const lightBoxImage = document.querySelector('.basicLightbox__placeholder img');
    console.log(lightBoxImage);
    lightBoxImage.setAttribute('src', url);
  }
  window.addEventListener('keydown', closeModalByKey);
}

function closeModalByKey(e) {
  if (e.code === 'Escape') {
    instance.close();
  }
}
