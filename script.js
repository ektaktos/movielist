$(document).ready(() => {
  $('#searchForm').submit(function(e) {
    $('#overlay').show();
    e.preventDefault();
    searchMovie()
    // do something
  });
  // Fixing broken image links
  $('img').on("error", function() {
    console.log('hola')
    $(this).attr('src', '/images/missing.png');
  });
  getMovies();
})
currentPage = 1;
totalPages = 0;
totalResults = 0;
query = '';
search = Boolean;

function next(){
  $('#overlay').show();
  var page = this.currentPage + 1;
  console.log(page);
  console.log(this.totalPages);
  if (this.totalPages > 0 && page > this.totalPages) {
    page = this.currentPage
  }
  if (this.search) {
    searchMovie(page);
  }else{
    getMovies(page);
  }
}

function previous(){
  $('#overlay').show();
  var page = this.currentPage - 1;
  if (page < 1) {
    page = this.currentPage
  }
  if (this.search) {
    searchMovie(page);
  }else{
    getMovies(page);
  }
}

function getMovies(page){
  this.search = false;
  if (!page) {
    page = 1;
  }
  $.get(`https://moviedb-test.herokuapp.com/api/movies?page=${page}`, (res) => {
    this.currentPage = page;
    this.totalPages = res.data.total_pages;
    this.totalResults = res.data.total_results;
    $('#results').text(this.totalResults)
    $('#movieCards').empty();
    if (this.totalResults > 0) {
    $.each(res.data.results, (index,value) => {
      var card = `<div class="col-sm-3 mb-4">
      <div class="card h-100">
        <img class="card-img-top" src="https://image.tmdb.org/t/p/w500${value.poster_path}" alt="">
        <div class="card-body">
          <h5 class="card-title">${value.title}</h5>
          <p class="card-text">${value.overview}</p>
          <div class="d-flex justify-content-between">
            <span class="card-text">${moment(value.release_date).format('MM/DD/YYYY')}</span>
            <span class="card-text rating"><img src="./images/star.png" width="18px" height="18px">${value.vote_average}</span>
          </div>
        </div>
      </div>
    </div>`;
    $('#movieCards').append(card);
      // console.log(value);
    });
    $('#overlay').hide();
  }else{
    var card = `<div class="col-sm-12 mb-4">
      <div class="empty-search">
       <h2> No Result Found</h2>
      </div>
    </div>`;
    var backButton = `<li class="page-item mr-3">
    <a class="page-link" href="" aria-label="Previous">
      <span aria-hidden="true">&laquo; Reload</span>
      <span class="sr-only">Previous</span>
    </a>
    </li>`
    $('#movieCards').append(card);
    $('#pagination').empty();
    $('#pagination').append(backButton);
  }
  })  
}

function searchMovie(page = null){
  this.query = $('#query').val();
  this.search = true;
  if (!page) {
    page = 1;
  }
  $.get(`https://moviedb-test.herokuapp.com/api/search?page=${page}&q=${this.query}`, (res) => {
    this.currentPage = page;
    this.totalPages = res.data.total_pages;
    this.totalResults = res.data.total_results; 
    $('#title').text(`Showing results for "${this.query}"`)
    $('#results').text(this.totalResults)
    $('#movieCards').empty()
    if (this.totalResults > 0) {
      $.each(res.data.results, (index,value) => {
        var card = `<div class="col-sm-3 mb-4">
        <div class="card h-100">
          <img class="card-img-top" src="https://image.tmdb.org/t/p/w500${value.poster_path}" onerror="this.src='./images/missing.png'" alt="">
          <div class="card-body">
            <h5 class="card-title">${value.title}</h5>
            <p class="card-text">${value.overview}</p>
            <div class="d-flex justify-content-between">
              <span class="card-text">${moment(value.release_date).format('MM/DD/YYYY')}</span>
              <span class="card-text rating"><img src="./images/star.png" width="18px" height="18px">${value.vote_average}</span>
            </div>
          </div>
        </div>
      </div>`;
      $('#movieCards').append(card);
        // console.log(value);
      }); 
      $('#overlay').hide();
    }else{
      var card = `<div class="col-sm-12 mb-4">
        <div class="empty-search">
         <h2> No Result Found</h2>
        </div>
      </div>`;
      var backButton = `<li class="page-item mr-3">
      <a class="page-link" href="" aria-label="Previous">
        <span aria-hidden="true">&laquo; Back to home</span>
        <span class="sr-only">Previous</span>
      </a>
      </li>`
      $('#movieCards').append(card);
      $('#pagination').empty();
      $('#pagination').append(backButton);
    }
    
  })  
}
