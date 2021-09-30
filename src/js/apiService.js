const API_KEY = '23491087-4191226b82b28486631b9987a';
const BASE_URL = 'https://pixabay.com/api/';

const quantity = 12;

import axios from 'axios';
axios.defaults.baseURL = BASE_URL;

export default class ApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchArticles(query) {
    const params = `?image_type=photo&orientation=horizontal&q=${this.searchQuery}&page=${this.page}&per_page=${quantity}&key=${API_KEY}`;

    const response = await axios.get(params);

    this.incrementPage();

    return response.data;
  }

  get pageNumber() {
    return this.page;
  }
  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  loadNextPage() {}
}
