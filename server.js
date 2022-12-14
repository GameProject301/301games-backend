"use strict";
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const server = express();
server.use(express.json());
server.use(cors());
const axios = require("axios");
const PORT = process.env.PORT || 3001;
const mongoose = require("mongoose");
mongoose.connect(
  "mongodb://abdallah:0000@ac-1odpauc-shard-00-00.acyygth.mongodb.net:27017,ac-1odpauc-shard-00-01.acyygth.mongodb.net:27017,ac-1odpauc-shard-00-02.acyygth.mongodb.net:27017/?ssl=true&replicaSet=atlas-mp85cf-shard-0&authSource=admin&retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);
// schema for Games
const GameSchema = new mongoose.Schema({
  name: String,
  image: String,
  platforms: Array,
  metacritic: String,
  genres: Array,
  email: String,
});

const GameModel = mongoose.model("Game", GameSchema);

const interestedSchema = new mongoose.Schema({
  email: String,
  interested: Array,
});

const interestedModel = mongoose.model("interested", interestedSchema);

//Routes
//http://localhost:3000
server.get("/", (req, res) => {
  res.send("hello,you are in home route");
});
// ================

server.post("/interested", interestedHandler);
async function interestedHandler(req, res) {
  console.log("hi interested");

  const { email, interested } = req.body;
  await interestedModel.create({
    email: email,
    interested: interested,
  });

  interestedModel.find({ email }, (err, result) => {
    if (err) {
      console.log("false");
      console.log(err);
    } else {
      console.log(result);
      res.send(result);
    }
  });
}
server.get("/interested", interestedHlyHandler);

async function interestedHlyHandler(req, res) {
  console.log("hi interestedModel");

  let email = req.query.email;
  console.log(email);
  interestedModel.find({ email: email }, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result)
      res.send(result);
    }
  });
}
// dd
//GameRoute
//http://localhost:3000/games
server.get("/games", gamesHandler);
//  just  for test database
async function seedData() {
  const test = new GameModel({
    name: "GTA",
    description:
      "A literary sensation and runaway bestseller, this brilliant novel presents with seamless authenticity and exquisite lyricism the true confessions of one of Japan's most celebrated geisha.",
    rate: "4.7",
    email: "abdallsdkgdg",
    platform: "dsdsgs",
  });
  await test.save();
}
server.get("/recently", recentlyHandler);
async function recentlyHandler(req, res) {
  console.log("hi recently");
  var today = new Date();
  let newN = today.toLocaleDateString("sv-SE");
  var lastMonth = new Date(new Date().setDate(today.getDate() - 30));
  let newMonth = lastMonth.toLocaleDateString("sv-SE");
  let url = `https://api.rawg.io/api/games?key=43fd5749eb674151bca70973fe88b05a&dates=${newMonth},${newN}`;
  //   console.log(newN)
  //   console.log(newMonth)
  //   console.log(url)
  GameModel.find({}, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      axios
        .get(url)
        .then((result) => {
          let gamesArr = result.data.results.map((item) => {
            return new Games(item);
          });
          res.status(200).send(gamesArr);
        })
        .catch((error) => {
          res.status(404).send(error);
        });
    }
  });
}


server.get("/generate",generateHandler)

 async function generateHandler(req,res){
  let page = req.query.page;
let url = `https://api.rawg.io/api/games?page=${page}&key=43fd5749eb674151bca70973fe88b05a`;
axios
    .get(url)
    .then((result) => {
        let gamesArr = result.data.results.map((item) => {
            new Games(item);
            return new Games(item);
        });
        res.status(200).send(gamesArr);
    })
    .catch((error) => {
        res.status(404).send(error);
    });
}

server.get("/category", catHandler);
async function catHandler(req, res) {
  console.log("hi cat");
  let genres = req.query.genres;
  // https://api.rawg.io/api/games?key=43fd5749eb674151bca70973fe88b05a&genres=card
  let url = `https://api.rawg.io/api/games?key=43fd5749eb674151bca70973fe88b05a&genres=${genres}`;

  GameModel.find({}, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      axios
        .get(url)
        .then((result) => {
          let gamesArr = result.data.results.map((item) => {
            return new Games(item);
          });
          res.status(200).send(gamesArr);
        })
        .catch((error) => {
          res.status(404).send(error);
        });
    }

    // seedData();
  });
}

server.get("/generate", generateHandler);
async function generateHandler(req, res) {
  let page = req.query.page;
  let url = `https://api.rawg.io/api/games?page=${page}&key=43fd5749eb674151bca70973fe88b05a`;
  axios
    .get(url)
    .then((result) => {
      let gamesArr = result.data.results.map((item) => {
        new Games(item);
        return new Games(item);
      });
      res.status(200).send(gamesArr);
    })
    .catch((error) => {
      res.status(404).send(error);
    });
}

server.get("/mylist", myListHandler);

async function myListHandler(req, res) {
  let email = req.query.email;
  console.log(email);
  GameModel.find({ email: email }, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
}
//function
server.get("/top", topHandler);
async function topHandler(req, res) {
  let url = `https://api.rawg.io/api/games?key=43fd5749eb674151bca70973fe88b05a&metacritic=96,98`;
  GameModel.find({}, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      axios
        .get(url)
        .then((result) => {
          let gamesArr = [];
          for (let i = 0; i < 10; i++) {
            gamesArr.push(new Games(result.data.results[i]));
          }
          res.status(200).send(gamesArr);
        })
        .catch((error) => {
          res.status(404).send(error);
        });
    }
  });
}
async function gamesHandler(req, res) {
  let parent_platforms = req.query.parent_platforms;
  let url = `https://api.rawg.io/api/games?parent_platforms=${parent_platforms}&key=43fd5749eb674151bca70973fe88b05a`;
  GameModel.find({}, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      axios
        .get(url)
        .then((result) => {
          let gamesArr = result.data.results.map((item) => {
            new Games(item);
            return new Games(item);
          });
          res.status(200).send(gamesArr);
        })
        .catch((error) => {
          res.status(404).send(error);
        });
    }
    // seedData();
  });
}
//classGames
class Games {
  constructor(item) {
    this.name = item.name;
    this.image = item.background_image;
    this.parent_platforms = item.parent_platforms.map((x) => x.platform.name);
    this.metacritic = item.metacritic;
    this.genres = item.genres.map((x) => x.name);
  }
}
server.post("/games", addHandler);

async function addHandler(req, res) {
  console.log("test Add");
  const { name, image, platforms, metacritic, genres, email } = req.body;
  await GameModel.create({
    name: name,
    image: image,
    platforms: platforms,
    metacritic: metacritic,
    genres: genres,
    email: email,
  });

  GameModel.find({ email }, (err, result) => {
    if (err) {
      console.log("false");
      console.log(err);
    } else {
      console.log(result);
      res.send(result);
    }
  });
}

//delete function
server.delete("/interested/:id", interestedDelete);

function interestedDelete(req, res) {
  console.log("test delete ");
  const interestedID = req.params.id;
  const email = req.query.email;
  interestedModel.deleteOne({ _id: interestedID }, (err, result) => {
    interestedModel.find({ email }, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
  });
}
server.delete("/games/:id", deleteHandler);
function deleteHandler(req, res) {
  console.log("test delete ");
  const gameId = req.params.id;
  const email = req.query.email;
  GameModel.deleteOne({ _id: gameId }, (err, result) => {
    GameModel.find({ email }, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
  });
}

//put function
server.put("/interested/:id", updateHandler);

function updateHandler(req, res) {
  console.log("test update");
  const id = req.params.id;
  const { email, interested } = req.body;

  interestedModel.findByIdAndUpdate(
    id,
    { email, interested },
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        interestedModel.find({ email }, (err, result) => {
          if (err) {
            console.log(err);
          } else {
            res.send(result);
          }
        });
      }
    }
  );
}
server.get("*", (req, res) => {
  res.send("Error 404:page not found ");
});
server.listen(PORT, () => console.log(`listening on ${PORT}`));