import express, { Application, json } from "express";

const app: Application = express();
app.use(json());

app.listen(3000, () => {
    console.log("Server is runnig!");
});