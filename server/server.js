const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const movieModel = require('./movie-model.js');

const app = express();

// Parse urlencoded bodies
app.use(bodyParser.json()); 

// Serve static content in directory 'files'
app.use(express.static(path.join(__dirname, 'files')));

/* Task 1.2: Add a GET /genres endpoint:
   This endpoint returns a sorted array of all the genres of the movies
   that are currently in the movie model.
*/
app.get('/genres', function (req, res) {
  const movies = Object.values(movieModel)
  const genres = [];
  console.log("Hallo just checking if backend is triggered");
  for(const movie of movies) {
    for(const genre of movie.Genres) {
      if(!genres.includes(genre))
      {
        genres.push(genre);
      }
    }
  }
  res.json(genres);
})

/* Task 1.4: Extend the GET /movies endpoint:
   When a query parameter for a specific genre is given, 
   return only movies that have the given genre
 */

// Configure a 'get' endpoint for a specific movie
app.get('/movies', function (req, res) {
  let movies = Object.values(movieModel);

  const genre = req.query.genre;

  if (genre) {
    movies = movies.filter(movie =>
      movie.Genres.includes(genre)
    );
  }

  res.json(movies);
});

app.get('/movies/:imdbID', function (req, res) {
  const imdbID = req.params.imdbID;

  console.log("imdbID from URL:", imdbID);
  console.log("available keys:", Object.keys(movieModel));

  const movie = movieModel[imdbID];

  if (!movie) {
    return res.sendStatus(404);
  }

  res.json(movie);
});

app.put('/movies/:imdbID', function(req, res) {

  const id = req.params.imdbID
  console.log(id)
  const exists = id in movieModel
  console.log(exists);

  movieModel[req.params.imdbID] = req.body;
  
  if (!exists) {
    res.status(201)
    res.send(req.body)
  } else {
    res.sendStatus(200)
  }
  
})

app.listen(3000)

console.log("Server now listening on http://localhost:3000/")
