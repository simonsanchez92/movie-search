const searchContainer = document.getElementById('search-container');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const resultText = document.getElementById('search-text');


const resultsContainer = document.getElementById('main');
const mainResults = document.getElementById('movies-container');


const goBackBtn = document.getElementById('go-back-btn');

const movieDetailEl = document.getElementById('movie-detail');




const pagination = document.getElementById('pagination');

//Global variables
let searchText = '';
let moviesResult = [];
let movieId;
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

const showMovies = async (movies, url)=>{
    //Destructure data
    const {page, results, total_pages} = movies;

    //Getting all genres 
    const data = await fetch(' https://api.themoviedb.org/3/genre/movie/list?api_key=4c0c205a5315c151196343cd53dbf96f&language=en-US');
    const res = await data.json();
    const {genres} = res;



    pagination.innerHTML = `
            <button class='btn' onclick="getPrevPage('${url}')"><i class="far fa-hand-point-left"></i>Prev</button>
            <button class='btn' onclick="getNextPage('${url}', '${total_pages}')">Next<i class="far fa-hand-point-right"></i></button>
    `

    //Insert search result text
    
    //Map over items and inject in UI
      
    mainResults.innerHTML = results.map((movie, i)=>{

        //Getting genres for each specific movie

        const genreId = movie.genre_ids;
        let movieGenres = [];
        
        genreId.forEach(id=>{
            genres.forEach(obj=>{
                if(id === obj.id){
                    movieGenres.push(obj.name);
                }
            })
        });
    console.log( movieGenres)
        
        // currentMovies.push(movie);
        // console.log(movie);

        return `<div class="movie-card">
        <i class="fas fa-tv"></i>
       
        <div class="movie-img-container">

        <img src="${movie.poster_path !== null ? IMG_PATH + movie.poster_path : 'img/default.jpg'}" alt="${movie.original_title}">
        
        <div class="card-overlay">
        
        <div class='movie-rating'>
            <i class="fas fa-star"></i>
            <span>${movie.vote_average}/10</span>
        </div>

        <ul>
        ${movieGenres.map(genre=> `<li>${genre}</li>`).join('')}
        </ul>

        <button onclick="movieDetail(${movie.id})">See More...</button>

        </div>
        
        </div> 
        
        <div class='title-year-box'>
        <span><b>${movie.original_title}</b></span>
        <span>${!movie.release_date ? '' : movie.release_date.split('-')[0]}</span>
        </div>
  
        </div>
        
        `
    }).join(""); 
}

{/* <h3>${movie.original_title}</h3> */}

async function movieDetail(id){
    console.log(id)
    const query = `https://api.themoviedb.org/3/movie/${id}?api_key=4c0c205a5315c151196343cd53dbf96f`
    const res = await fetch(query);
    const data = await res.json();
    
 
    showMovieDetail(data)
   
}

function showMovieDetail(data){

    resultsContainer.style.display = 'none';


    movieDetailEl.style.display = 'flex';
    pagination.style.display = 'none';
    movieDetailEl.innerHTML = `
    
    
    <h3 class='movie-title'>${data.title}<i class="fas fa-film"></i></h3>

    <div class='movie-data'>

    <div class='img-container'>
        <img src='${data.poster_path !== null ? IMG_PATH + data.poster_path : 'img/default.jpg'}' alt='${data.original_title}'/>
    </div>

    <div class='movie-data-list'>
        <p>${data.overview}</p>

        <ul>
        <li><i class="fas fa-star"></i>imdbRating: ${data.imdb_id}</li>
        <li><i class="fas fa-star"></i>Year: ${data.release_date}</li>
    </ul>
    </div>
    

    </div>
    <button class='return-btn' id='return-btn' onclick=returnHome()>Return<i class="fas fa-undo-alt return-btn-icon"></i></button>
    `
    
}

function returnHome() {
    resultsContainer.style.display = 'flex';
    pagination.style.display = 'flex';

    movieDetailEl.style.display = 'none';
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




//Event listeners
searchInput.addEventListener('input', (e) => {
    searchText = e.target.value.trim();
    
});

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
   
    if(searchText !== ''){
        resultsContainer.style.display = 'flex';
        mainResults.innerHTML = '';
        resultText.innerText = `Results for '${searchText}'`;
        page = 1;
        const query = SEARCH_API + searchText + `&page=${page}`;
        console.log(query)
        getMovies(query);
        searchInput.value = '';
        searchText = '';
    }
   
    
})