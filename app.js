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
    db = await open({
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
    movieId: dbObject.movie_id,
    directorId: dbObject.director_id,
    movieName: dbObject.movie_name,
    leadActor: dbObject.lead_actor,
  };
};

const convertDirectorDbObjectToResponseObject = (dbPath) => {
  return {
    directorId: dbObject.director_id,
    directorName: dbObject.director_name,
  };
};

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

// psst API method

app.post("/movies/", async (request, response) => {
  const { directorId, movieName, leadActor } = request.body;
  const postMoviesQuery = `
    INSERT INTO
    movie(director_id, movie_name, lead_role)
    VALUES(${directorId}, ${movieName}, ${leadActor});`;

  await db.run(postMoviesQuery);
  response.send("Movie Successfully Added");
});

app.get("/movies/:movieId", async (request, response) => {
  const { movieId } = request.params;
  const getMovieFromId = `
    SELECT *
    FROM movie
    WHERE movie_id = ${movieId};`;

  const movieData = await db.get(getMovieFromId);

  response.send(convertMovieDbObjectToResponseObject(movieData));
});

// Update Movie

app.put("/movies/:movieId", async (request, response) => {
  const { directorId, movieName, leadActor } = request.body;
  const { movieId } = request.params;

  const updateMovie = `
    UPDATE movie
    SET 
    director_id = ${directorId},
    movie_name = ${movieName},
    lead_actor = ${leadActor}
    WHERE movie_id = ${movieId};`;

  await db.get(updateMovie);
  response.send("Movie Details Updated");
});

// Delete movie

app.delete("/movies/:movieId", async (request, response) => {
  const { movieId } = request.params;
  const deleteMovieData = `
    DELETE FROM movie
    WHERE movie_id = ${movieId};`;

  await db.run(deleteMovieData);
  response.send("Movie Removed");
});

// GET Directors

app.get("/directors/", async (request, response) => {
  const getDirectorDetails = `
    SELECT *
    FROM director;`;

  const DirectorDetails = await db.all(getDirectorDetails);

  response.send(
    DirectorDetails.map((eachDirector) =>
      convertDirectorDbObjectToResponseObject(eachDirector)
    )
  );
});

// GET movies Directed by specific Director

app.get("/director/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;
  const getSpecificMovie = `
    SELECT movie_name
    FROM movie
    WHERE director_id = ${directorId};`;

  const specificMovie = await db.all(getSpecificMovie);

  response.send(
    specificMovie.map((movie) => ({ movieName: movie.movie_name }))
  );
});

module.exports = app;
