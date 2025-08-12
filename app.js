const navBrowse = document.getElementById('nav-browse');
const navFavs = document.getElementById('nav-favs');
const viewBrowse = document.getElementById('view-browse');
const viewFavs = document.getElementById('view-favs');
const grid = document.getElementById('grid');
const favGrid = document.getElementById('favGrid');
const message = document.getElementById('message');
const favMsg = document.getElementById('favMsg');
const loading = document.getElementById('loading');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageNumSpan = document.getElementById('pageNum');
const backToBrowseBtn = document.getElementById('backToBrowse');

let currentPage = 1;
//const limit = 6;

function getLimitFromGrid() {
  const gridStyles = window.getComputedStyle(document.querySelector('.grid'));
  const columns = gridStyles.getPropertyValue('grid-template-columns').split(' ').length;
  const rows = gridStyles.getPropertyValue('grid-template-rows').split(' ').length;
  return columns * rows;
}

let limit = getLimitFromGrid();

window.addEventListener('resize', () => {
  limit = getLimitFromGrid();
  currentPage = 1;
  loadCats();
});


let totalCats = 0; 
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];


navBrowse.addEventListener('click', () => {
  showBrowse();
});
navFavs.addEventListener('click', () => {
  showFavorites();
});
backToBrowseBtn.addEventListener('click', () => {
  showBrowse();
});

prevBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    loadCats();
  }
});

nextBtn.addEventListener('click', () => {
  currentPage++;
  loadCats();
});

function showBrowse() {
  navBrowse.classList.add('active');
  navFavs.classList.remove('active');
  viewBrowse.classList.remove('hidden');
  viewFavs.classList.add('hidden');
  message.textContent = '';
  favMsg.textContent = '';
  loadCats();
}






















let favCurrentPage = 1;
let favTotal = 0;

// function loadFavorites() {
//     const start = (favCurrentPage - 1) * limit;
//     const end = start + limit;
//     const favsToShow = favorites.slice(start, end);

//     const favGrid = document.querySelector('#favGrid');
//     favGrid.innerHTML = "";

//     favsToShow.forEach(cat => {
//         const card = createCatCard(cat);
//         favGrid.appendChild(card);
//     });

//     favTotal = favorites.length;
//     updateFavPagination();
// }

// function updateFavPagination() {
//     document.getElementById('prevBtnFav').disabled = favCurrentPage === 1;
//     document.getElementById('nextBtnFav').disabled = favCurrentPage * limit >= favTotal;
// }

// document.getElementById('prevBtnFav').addEventListener('click', () => {
//     if (favCurrentPage > 1) {
//         favCurrentPage--;
//         loadFavorites();
//     }
// });

// document.getElementById('nextBtnFav').addEventListener('click', () => {
//     if (favCurrentPage * limit < favTotal) {
//         favCurrentPage++;
//         loadFavorites();
//     }
// });

// window.addEventListener('resize', () => {
//     limit = getLimitFromGrid();
//     favCurrentPage = 1;
//     loadFavorites();
// });

function loadFavorites() {
  favGrid.innerHTML = '';
  favMsg.textContent = '';

  if (favorites.length === 0) {
    favMsg.textContent = 'No favorites yet. Go add some!';
    document.getElementById('prevBtnFav').disabled = true;
    document.getElementById('nextBtnFav').disabled = true;
    return;
  }

  const start = (favCurrentPage - 1) * limit;
  const end = start + limit;
  const favsToShow = favorites.slice(start, end);

  favsToShow.forEach(catId => {
    const card = createCatCard(catId); 
    favGrid.appendChild(card);
  });

  updateFavPagination();
}

function updateFavPagination() {
  document.getElementById('prevBtnFav').disabled = favCurrentPage === 1;
  document.getElementById('nextBtnFav').disabled = favCurrentPage * limit >= favorites.length;
}

document.getElementById('prevBtnFav').addEventListener('click', () => {
  if (favCurrentPage > 1) {
    favCurrentPage--;
    loadFavorites();
    document.getElementById('pageNumFav').textContent = favCurrentPage;
  }
});

document.getElementById('nextBtnFav').addEventListener('click', () => {
  if (favCurrentPage * limit < favorites.length) {
    favCurrentPage++;
    loadFavorites();
    document.getElementById('pageNumFav').textContent = favCurrentPage;
  }
});
function createCatCard(catId) {
  const card = document.createElement('div');
  card.classList.add('card');
  card.style.position = 'relative';

  const img = document.createElement('img');
  img.src = `https://cataas.com/cat/${catId}`;
  img.alt = 'Cat Image';
  img.title = favorites.includes(catId) ? 'Click to remove from favorites' : 'Click to add to favorites';

  card.appendChild(img);

  const favBtn = document.createElement('button');
  favBtn.classList.add('fav-btn');
  favBtn.textContent = favorites.includes(catId) ? '★' : '☆';
  favBtn.title = favorites.includes(catId) ? 'Remove from favorites' : 'Add to favorites';

  if (favorites.includes(catId)) {
    favBtn.classList.add('active');
  }

  favBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleFavorite(catId, favBtn);
    loadFavorites(); 
  });

  card.appendChild(favBtn);

  return card;
}






















































function showFavorites() {
  navFavs.classList.add('active');
  navBrowse.classList.remove('active');
  viewFavs.classList.remove('hidden');
  viewBrowse.classList.add('hidden');
   favCurrentPage = 1; 
  loadFavorites();
  //renderFavorites();
}

async function loadCats() {
  message.textContent = '';
  showLoading(true);

  const skip = (currentPage - 1) * limit;
  const url = `https://cataas.com/api/cats?skip=${skip}&limit=${limit}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    const cats = await response.json();
    showLoading(false);
    if (cats.length === 0 && currentPage > 1) {
      currentPage--;
      return;
    }

    renderCats(cats);
    updatePaginationButtons(cats.length);

  } catch (error) {
    showLoading(false);
    message.textContent = 'Failed to load cats. Please try again.';
  }
}

function renderCats(cats) {
  grid.innerHTML = '';

  cats.forEach(cat => {
    // const img = document.createElement('img');
    // img.src = `https://cataas.com/cat/${cat.id}`;
    // img.alt = 'Cat Image';
    // img.title = favorites.includes(cat.id) ? 'Click to remove from favorites' : 'Click to add to favorites';

    // if (favorites.includes(cat.id)) {
    //   img.classList.add('favorite');
    // }

    // img.addEventListener('click', () => {
    //   toggleFavorite(cat.id, img);
    // });

    // grid.appendChild(img);


    // إ
const card = document.createElement('div');
card.classList.add('card');

// 
const img = document.createElement('img');
img.src = `https://cataas.com/cat/${cat.id}`;
img.alt = 'Cat Image';
img.title = favorites.includes(cat.id) ? 'Click to remove from favorites' : 'Click to add to favorites';


card.style.position = 'relative';

card.appendChild(img);

const favBtn = document.createElement('button');
favBtn.classList.add('fav-btn');
favBtn.title = favorites.includes(cat.id) ? 'Remove from favorites' : 'Add to favorites';
favBtn.textContent = favorites.includes(cat.id) ? '★' : '☆';

if (favorites.includes(cat.id)) {
  favBtn.classList.add('active');
}


favBtn.addEventListener('click', (e) => {
  e.stopPropagation();  
  toggleFavorite(cat.id, favBtn);
});


card.appendChild(favBtn);

grid.appendChild(card);


  });

  pageNumSpan.textContent = currentPage;
}

function toggleFavorite(catId, btnElement) {
  const index = favorites.indexOf(catId);
  if (index === -1) {
    favorites.push(catId);
    btnElement.textContent = '★';
    btnElement.classList.add('active');
    btnElement.title = 'Remove from favorites';
  } else {
    favorites.splice(index, 1);
    btnElement.textContent = '☆';
    btnElement.classList.remove('active');
    btnElement.title = 'Add to favorites';
  }
  localStorage.setItem('favorites', JSON.stringify(favorites));

  if (!viewFavs.classList.contains('hidden')) {
    renderFavorites();
  }
}


function renderFavorites() {
  favGrid.innerHTML = '';
  favMsg.textContent = '';

  if (favorites.length === 0) {
    favMsg.textContent = 'No favorites yet. Go add some!';
    return;
  }

  favorites.forEach(catId => {
    const img = document.createElement('img');
    img.src = `https://cataas.com/cat/${catId}`;
    img.alt = 'Favorite Cat';
    img.title = 'Click to remove from favorites';
    img.classList.add('favorite');

    img.addEventListener('click', () => {
      toggleFavorite(catId, img);
    });

    favGrid.appendChild(img);
  });
}

function showLoading(show) {
  loading.classList.toggle('hidden', !show);
}

function updatePaginationButtons(catsCount) {
  prevBtn.disabled = currentPage === 1;

  nextBtn.disabled = catsCount < limit;
}

showBrowse();



const clearFavoritesBtn = document.getElementById('clearFavorites');

clearFavoritesBtn.addEventListener('click', () => {
  favorites = [];
  localStorage.setItem('favorites', JSON.stringify(favorites));
  renderFavorites();
});
