import SimpleLightbox from "simplelightbox";
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import { getImages, Per_page } from './pixabay-api.js';

const refs = {
    form: document.querySelector('.search-form'),
    input: document.querySelector('[name="searchQuery"]'),
    submitBtn: document.querySelector('[type="submit"]'),
    divImg: document.querySelector('.gallery'),
    loadBtn: document.querySelector('.load-more')
};

let simple = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

let page = 1;
let searchQuery = '';
let isSubmit = true;

refs.form.addEventListener('submit', onFormSubmit);
refs.loadBtn.addEventListener('click', onLoadBtnClick);


 function onFormSubmit(e) {
    e.preventDefault();
  
   
    page = 1;
    refs.divImg.innerHTML = '';
    searchQuery = refs.input.value.trim();

   if (!searchQuery.trim()) {
      refs.loadBtn.classList.add('is-hidden');
     return   Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
        );
 }
    
    renderPage();
    e.target.reset();
};
 
async function renderPage() {
  
  try {
    const response = await getImages(searchQuery, page);
    
    if (isSubmit) { Notiflix.Notify.success(`Hooray! We found ${response.totalHits} images.`);}
        
        createMarkup(response.hits);
        simple.refresh();

       const lastPage = Math.ceil(response.totalHits / Per_page);

        if (lastPage === page) {
            Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.")
          refs.loadBtn.classList.add('is-hidden');
          return;
        }

      if (response.hits.length < Per_page) return;
    refs.loadBtn.classList.remove('is-hidden');
    
    isSubmit = true;

    } catch (error) {
        Notiflix.Notify.failure('Oops! Something went wrong! Try reloading the page!')
    }
 };



function createMarkup(img) {

    const markup = img.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
      return  `<div class="photo-card">
    <a class="gallery_link" href="${largeImageURL}">
    <img src="${webformatURL}" alt="${tags}" width = "300" height = "200" loading="lazy" />
    <div class="info">
    <p class="info-item">
      <b>Likes: ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${downloads}</b>
    </p>
    </div>
    </div>`
    }).join('');


    refs.divImg.insertAdjacentHTML('beforeend', markup);
};
 

function onLoadBtnClick() { 
    page += 1;
  renderPage();
  isSubmit = false;
};
