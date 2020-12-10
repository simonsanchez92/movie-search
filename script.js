const searchContainer = document.getElementById('search-container');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const resultText = document.getElementById('search-result-text');
const searchResults = document.getElementById('main');
const readPlotBtn = document.getElementById('read-plot');
const goBackBtn = document.getElementById('go-back-btn');

const movieDetailEl = document.getElementById('movie-detail');
const movieDetailContainer = document.getElementById('movie-detail-container')

const mainResults = document.getElementById('main-movies');


const pagination = document.getElementById('pagination');

//Global variables

let searchText = '';
let moviesResult = [];
let page = 1;

const API_URL =`https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=4c0c205a5315c151196343cd53dbf96f&page=${page}`;
const SEARCH_API = 'https://api.themoviedb.org/3/search/movie?api_key=4c0c205a5315c151196343cd53dbf96f&query='
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';


window.onload = () => {
    searchContainer.style.transform = 'translateX(0%)';
    searchContainer.style.opacity = '1';
}


//********************/



// Getting initial movies

const getMovies = async (url)=>{
   const res = await fetch(url);
   const data = await res.json();
   
   console.log(data);
   showMovies(data, url);
}

getMovies(API_URL);

const showMovies = (movies, url)=>{
    //Destructure data
    const {page, results, total_pages} = movies;
   
    pagination.innerHTML = `
            <button class='btn' onclick="getPrevPage('${url}')">Prev</button>
            <button class='btn' onclick="getNextPage('${url}', '${total_pages}')">Next</button>
    `

    //Insert search result text

    // resultText.innerText = `Results for '${searchText}'` 
  
    // searchResults.appendChild(resultText);
    
    //Map over items and inject in UI
      
    mainResults.innerHTML = results.map((movie, i)=>{
        // currentMovies.push(movie);
        return `<div class="movie-card">
        <i class="fas fa-tv"></i>
        <h3>${movie.original_title}</h3>
        <div class="movie-img-container">
        <img src="${movie.poster_path !== null ? IMG_PATH + movie.poster_path : 'img/default.jpg'}" alt="${movie.original_title}">
        </div> 
        <div class="card-overlay"> <button onclick="getMovieDetail(${i})">See More...</button></div>
        </div>`
    }).join(""); 

   
}



//Pagination 

const getNextPage= (url, totalPages)=>{
    if(page < totalPages){
    page++;
    const query = url.split('&page=')[0] + `&page=${page}`;
    getMovies(query);
   }
}

const getPrevPage = (url)=>{  
    if(page > 1){
        page--;
        const query = url.split('&page=')[0] + `&page=${page}`;
        getMovies(query);       
    }  
}



// async function getAllData() {
//     // moviesResult = [];
//     const res = await fetch(`http://www.omdbapi.com/?s=${searchText}&apikey=9bdd7c5c`);
//     const data = await res.json();

//     console.log(data.Response)


    
            
//             if (data.Response !== 'False') {
//                 moviesResult.push(data);
              
//                 let results= [];
//                 moviesResult[0].Search.forEach((movie, i)=>{results.push(movie)});
//                 moviesResult = results;
//                 console.log(moviesResult);
//                 populateUI(moviesResult)
//             }
    
    
// }



// function populateUI(results) {

//     //Insert search result text

//     resultText.innerText = `Results for '${searchText}'` 
  
//     searchResults.appendChild(resultText);
    
//     //Map over items and inject in UI
      
//     mainResults.innerHTML = results.map((movie, i)=>{
//         // currentMovies.push(movie);
//         return `<div class="movie-card">
//         <i class="fas fa-tv"></i>
//         <h3>${movie.Title}</h3>
//         <div class="movie-img-container">
//         <img src="${movie.Poster === 'N/A' ? 'img/default.jpg' : movie.Poster}" alt="${movie.Title}">
//         </div> 
//         <div class="card-overlay"> <button onclick="getMovieDetail(${i})">See More...</button></div>
//         </div>`
//     }).join(""); 
// }



//Detail page
let currentMovie;
function getMovieDetail(movieIndex) {
    let title = moviesResult[movieIndex].Title;
  
    fetch(`http://www.omdbapi.com/?t=${title}&apikey=9bdd7c5c`)
    .then(res=> res.json())
    .then(data=>{
        currentMovie = data;
        showMovieDetail(data);
       
    });
    
searchResults.style.display = 'none';
}


function showMovieDetail(data) {

    if (data.Title === undefined) {
        // readPlotBtn.style.display = 'none';
        // goBackBtn.style.visibility = 'hidden';
    } else {
       
        readPlotBtn.style.display = 'block';
        
        movieDetailContainer.innerHTML = `
        
        <div class='results-info'>
        <div class='movie-data'>
        <h3 class='movie-title'>${data.Title}<i class="fas fa-film"></i></h3>
        <ul class='movie-data-list'>
            <li><i class="fas fa-star"></i>imdbRating: ${data.imdbRating}</li>
            <li><i class="fas fa-star"></i>Year: ${data.Year}</li>
            <li><i class="fas fa-star"></i>Director: ${data.Director}</li>
            <li><i class="fas fa-star"></i>Featuring: ${data.Actors}</li>         
            <li><i class="fas fa-star"></i>Country: ${data.Country}</li>

            <li><i class="fas fa-star"></i>Genre: ${data.Genre}</li>
            <li><i class="fas fa-star"></i>BoxOffice: ${data.BoxOffice}</li>
        </ul>
        <button class='return-btn' id='return-btn' onclick=returnHome()><i class="fas fa-undo-alt return-btn-icon"></i></button>
        <button class='read-plot' id='read-plot' onclick=readPlot()>Read plot</button>
        
        </div>
        
        ${data.Poster !== 'N/A' ? `<div class="img-container">
        <img src=${data.Poster} alt='${data.Title}'></img>
        </div>` : ''}
        
        </div>`
        goBackBtn.style.visibility = 'flex';
        movieDetailEl.style.display = 'flex';
    }
   
    
}

function readPlot() {
  
let currentTitle = currentMovie.Title;
   

    fetch(`http://www.omdbapi.com/?t=${currentTitle}&apikey=9bdd7c5c`)
        .then(res => res.json())
        .then(data => {

            movieDetailEl.classList.add('plot');
            movieDetailContainer.innerHTML = `
        
        <div class='results-info'>
        <div class='movie-data'>
        <h3>${data.Title}<i class="fas fa-film"></i></h3>
        
        <p class='plot-text'>${data.Plot}<p>
        
        <button class='go-back-btn' id='go-back-btn' onclick=goBack()>Go back</button>
        <button class='return-btn' id='return-btn' onclick=returnHome()><i class="fas fa-undo-alt return-btn-icon"></i></button>
        </div>
        </div>
        
        ${data.Poster !== 'N/A' ? `<div class="img-container">
        <img src=${data.Poster} alt='${data.Title}'></img>
        </div>` : ''}     
        
        `
        })
}

function goBack() {
    console.log(currentMovie);
    movieDetailContainer.innerHTML = '';
    showMovieDetail(currentMovie);
    movieDetailEl.classList.remove('plot');
    // goBackBtn.style.visibility = 'hidden';
    readPlotBtn.style.visibility = 'visible';
}

function returnHome() {
    searchResults.style.display = 'flex';
    movieDetailEl.style.display = 'none';
}






//Event listeners
searchInput.addEventListener('input', (e) => {
    searchText = e.target.value.trim();
    // console.log(searchText);
});

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    currentMovie = undefined;
   searchResults.style.display = 'flex';
    // mainResults.innerHTML = '';
    // getAllData();
    page = 1;
    const query = SEARCH_API + searchText + `&page=${page}`;
    console.log(query)
    getMovies(query);
    searchInput.value = '';
    // populateUI();
})