import express, { Application, json } from "express";
import { startDatabase } from "./database";
import { createMovie, deleteMovie, listMovies, updateMovie } from "./logic";
import { verifyMovieInfoExists, verifyMovieNameExists } from "./middlewares";

const app: Application = express();
app.use(json());

app.post("/movies", verifyMovieNameExists, createMovie);
app.get("/movies", listMovies);
app.patch("/movies/:id", verifyMovieInfoExists, verifyMovieNameExists, updateMovie);
app.delete("/movies/:id", verifyMovieInfoExists, deleteMovie);

app.listen(3000, async () => {
    await startDatabase();
    console.log("Server is runnig!");
});