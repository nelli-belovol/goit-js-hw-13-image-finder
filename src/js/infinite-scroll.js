import InfiniteScroll from 'infinite-scroll';

import refs from './refs.js';
const { form, list } = refs;
const API_KEY = '23491087-4191226b82b28486631b9987a';
let searchQuery = '';

const infScroll = new InfiniteScroll('.gallery', {
  responseType: 'text',
  history: false,
  status: `.page-load-status`,
  path() {
    return `https://https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${searchQuery}&key=${API_KEY}.org/v2/everything?q=bitcoin&apiKey=bb47a995514a49758140b073ef1103f5`;
  },
});

form.addEventListener('submit', onSearch);

async function onSearch(e) {
  e.preventDefault();

  searchQuery = e.target.elements.search.value;
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
