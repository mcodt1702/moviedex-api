require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const PORT = 8000;
const helmet = require("helmet");
const cors = require("cors");
const app = express();
const DATA = require("./data");

app.use(helmet());
app.use(cors());
app.use(morgan("custom"));
app.use(function validateBearerToken(req, res, next) {
  console.log("validate bearer token middleware");
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get("Authorization");

  if (!authToken || authToken.split(" ")[1] !== apiToken) {
    return res.status(401).json({ error: "Unauthorized request" });
  }

  next();
});

app.get("/movie", handleGetMovie);

function handleGetMovie(req, res) {
  let response = DATA.movieData;
  const genres = req.query.genre;
  const countries = req.query.country;
  const ratings = req.query.avg_vote;

  if (genres) {
    response = response.filter((item) =>
      item.genre.toLowerCase().includes(genres.toLowerCase())
    );
  }

  if (countries) {
    response = response.filter((nat) =>
      nat.country.toLowerCase().includes(countries.toLowerCase())
    );
  }

  if (ratings) {
    response = response.filter(
      (item) => Number(item.avg_vote) >= Number(ratings)
    );
  }
  res.json(response);
}

app.listen(PORT, () => {
  console.log(`server listenign on port ${PORT}`);
});
