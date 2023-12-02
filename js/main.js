const API_KEY = "240ab21c-1ac0-48e0-8f78-b185ca581a79";
const API_URL_TOP =
  "https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1";
const API_URL_SEARCH =
  "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=";
const API_URL_MOVIE_ID = "https://kinopoiskapiunofficial.tech/api/v2.2/films/";

getMovies(API_URL_TOP);

async function getMovies(url) {
  const resp = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": API_KEY,
    },
  });

  const respData = await resp.json();
  showMovies(respData);
}

function getRating(rate) {
  if (rate >= 7) {
    return "green";
  } else if (rate > 5) {
    return "orange";
  } else {
    return "red";
  }
}

function checkRating(el) {
  if (el.at(-1) == "%") {
    let num = parseFloat(el) / 10;
    return num.toString();
  } else {
    return el;
  }
}

function checkRatingNull(el) {
  if (el == null || el == "null") {
    return "";
  }
  return el;
}

function checkMovie(el) {
  if (el == undefined || el == null) {
    return "-";
  }
  return el;
}

function showMovies(data) {
  const moviesEl = document.querySelector(".movies");

  document.querySelector(".movies").innerHTML = ""; //очищаем предыдущие фильмы

  data.films.forEach((movie) => {
    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");
    movieEl.innerHTML = `
    <div class="movie__cover-inner">
    <img
      class="movie__cover"
      src="${movie.posterUrlPreview}"
      alt="${movie.nameRu}"
    />
    <div class="movie__cover--darkened"></div>
  </div>
  <div class="movie__info">
    <div class="movie__title">${checkMovie(movie.nameRu)}</div>
    <div class="movie__category">${movie.genres.map(
      (genre) => ` ${genre.genre}`
    )}</div>
    ${
      checkRatingNull(movie.rating) &&
      `<div class="movie__average movie__average--${getRating(
        checkRating(movie.rating)
      )}">${checkRating(movie.rating)}</div>`
    }
  </div>`;
    movieEl.addEventListener("click", () => openModal(movie.filmId));
    moviesEl.appendChild(movieEl);
  });
}
const form = document.querySelector("form");
const search = document.querySelector(".header__search");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const apiSearchUrl = `${API_URL_SEARCH}${search.value}`;
  if (search.value) {
    getMovies(apiSearchUrl);
    search.value = "";
  }
});

//Modal
const modalEl = document.querySelector(".modal");
async function openModal(id) {
  const resp = await fetch(API_URL_MOVIE_ID + id, {
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": API_KEY,
    },
  });
  const respData = await resp.json();

  modalEl.classList.add("modal--show");

  document.body.classList.add("stop-scrolling"); //убираю скролл при открытии поп-ап окна

  modalEl.innerHTML = `
<div class="modal__card">
 <img class="modal__movie-backdrop" src="${respData.posterUrl}" alt="">
 <h2>
  <span class="modal__movie-title">${checkMovie(respData.nameRu)},</span>
  <span class="modal__movie-release-year">${respData.year}</span>
 </h2>
 <ul class="modal__movie-info">
 <div class="loader"></div>
 <li class="modal__movie-genre">Жанр :  ${respData.genres.map(
   (el) => `<span>${el.genre}</span>`
 )}</li>
 ${
   respData.filmLength
     ? `<li class="modal__movie-runtime">${respData.filmLength} мин</li>`
     : ""
 }
 <li>Сайт: <a class="modal__movie-site" href="${respData.webUrl}">${
    respData.webUrl
  }</a></li>
 <li class="modal__movie-overview">${checkMovie(respData.description)}</li>
 </ul>
 <button type="button" class="modal__button-close">Закрыть</button>
</div>
`;
  const btnClose = document.querySelector(".modal__button-close");
  btnClose.addEventListener("click", () => closeModal());
}

function closeModal() {
  modalEl.classList.remove("modal--show");
  document.body.classList.remove("stop-scrolling");
}
//закрытие поп-ап окна по щелчку на область рядом
window.addEventListener("click", (e) => {
  if (e.target === modalEl) {
    closeModal();
  }
});
//закрытие поп-ап по клавише esc
window.addEventListener("keydown", (e) => {
  if (e.keyCode === 27) {
    modalEl.classList.remove("modal--show"); //или просто: closeModal();
  }
});
