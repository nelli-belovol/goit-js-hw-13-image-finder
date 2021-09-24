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
  //   const divs = document.getElementsByClassName('scroll-element');
  //   divs.classList.remove('scroll-element');
  const newDiv = document.createElement('div');
  newDiv.classList.add('my-element-selector');
  const items = template(array);
  newDiv.insertAdjacentHTML('beforeend', items);
  list.append(newDiv);
}

async function fetchPhotos() {
  loadMoreBtn.disable();
  try {
    const articles = await apiService.fetchArticles();
    createMarkUp(articles);
  } catch (error) {
    if (articles.length === 0) {
      error({
        text: `По Вашему запросу ничего не найдено`,
      });
    }
    console.log(error);
  }
  loadMoreBtn.enable();
}

function clearArticlesContainer() {
  list.innerHTML = '';
}
