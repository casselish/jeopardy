let express = require('express')
  , router = express.Router();
let request = require('request');
var categoryIDs = [];
request("http://jservice.io/api/categories?count=100", function (err, response, body) {
  let categoryResponse = JSON.parse(body);
  console.log(categoryResponse);
  if (!err) {
    for (int i = 0; i <= categoryResponse.length-1; i++) {
      categoryIDs.push(categoryResponse[i].id);
    }
    console.log(categoryIDs);
  }
});

request("http://www.omdbapi.com/?apikey="+apikey+"&i="+movieID+"&r=json", function(err, response, body) {
            let movieResponse = JSON.parse(body);
            if(!err){
              let newMovie={
                "title": movieResponse.Title,
                "year": movieResponse.Year,
                "rating": movieResponse.Rated,
                "director": movieResponse.Director,
                "actors": movieResponse.Actors,
                "plot": movieResponse.Plot,
                "poster": movieResponse.Poster,
                "showtimes": ["3:00", "5:30", "8:45"]
              }
              let newID = (movieResponse.Title+" "+movieResponse.Year).replace(/ /g,"_");
              Movie.saveMovie(newID, newMovie);
              res.redirect('/movies');
      }
      else{
          res.redirect('/movies');
      }

    });
