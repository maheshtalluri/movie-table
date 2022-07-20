const express = require("express");

const app = express();

app.use(express.json());

const path = require("path");

const { open } = require("sqlite");

const sqlite3 = require("sqlite3");

const dbPath = path.join(__dirname, "moviesData.db");

let db = null;

const initializerDBAndServer = async () => {
  try {
    let db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () => {
      console.log("Server running at http://localhost:3000/");
    });
  } catch (error) {
    console.log(`DB error: ${error.message}`);
    process.exit(1);
  }
};

initializerDBAndServer();

const convertMovieDbObjectToResponseObject = (dbObject) => {
    return {
        movieId = dbObject.movie_id,
        directorId = dbObject.director_id,
        movieName = dbObject.movie_name,
        leadRole = dbObject.lead_role
    };
};

const convertDirectorDbObjectToResponseObject = (dbPath) => {
    return {
        directorId = dbObject.director_id,
        directorName = dbObject.director_name
    }
}

// GET all movie list

// app.get("/movies/", async (request, resolve) => {
//     const getMoviesQuery = `
//     SELECT movie_name
//     FROM movie;`;
//     const movieNamesList = await db.all(getMoviesQuery);
//     response.send(movieNamesList.map((movie) => ({movieName: movie.movie_name}))
//     );
// })

app.get("/movies/", async (request, response) => {
  const getMoviesQuery = `
    SELECT
      movie_name
    FROM
      movie;`;
  const moviesArray = await db.all(getMoviesQuery);
  response.send(
    moviesArray.map((eachMovie) => ({ movieName: eachMovie.movie_name }))
  );
});
