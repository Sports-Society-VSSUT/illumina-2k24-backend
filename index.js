// server.js

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const socketIO = require("socket.io");
const eventRoute = require('./Routes/eventRoutes')
const port = process.env.PORT || 5000;
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(cors());
require('dotenv').config();
let dbConnection;

const databaseUrl = process.env.DATABASE_URL;
//Database Connection
const connectToDb = (cb) => {
  mongoose
  .connect(`${databaseUrl}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    dbConnection = mongoose.connection;
    return cb(null);
  })
  .catch((err) => {
    console.error(err);
    return cb(err);
  });
};

const getDb = () => dbConnection;


app.use("/events", eventRoute);


connectToDb((err) => {
  if (err) {
    console.error("Error occurred while connecting to the database:", err);
    return;
  }
  console.log("Connected successfully to the database");
  
  
//Websocket Implementation
  
  const server = http.createServer(app);
  const io = socketIO(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  app.get("/getStoredDatafootball", (req, res) => {
    res.json(storedDatafootball);
  });

  app.get("/getStoredDatacricket", (req, res) => {
    res.json(storedDatacricket);
  });

  app.get("/getStoredDatavolleyball", (req, res) => {
    res.json(storedDatavolleyball);
  });

  app.get("/getStoredDatakhokho", (req, res) => {
    res.json(storedDatakhokho);
  });

  app.get("/getStoredDatakabbadi", (req, res) => {
    res.json(storedDatakabbadi);
  });

  app.delete("/deleteStoredData", (req, res) => {
    try {
      storedDatafootball = [];
      storedDatacricket = []; 
      storedDatavolleyball = []; 
      storedDatakabbadi=[];
      storedDatakhokho=[];
  
      res.json({ success: true, message: "Scores are reset." });
    } catch (error) {
      console.error("Error deleting stored data:", error);
      res.status(500).json({ success: false, message: "Internal server error." });
    }
  });

  let storedDatafootball = [];
  let storedDatacricket = [];
  let storedDatavolleyball = [];
  let storedDatakhokho=[];
  let storedDatakabbadi=[];

  io.on("connection", (socket) => {
    console.log("A user connected");
    socket.emit("storedDatafootball", storedDatafootball);
    socket.emit("storedDatacricket", storedDatacricket);
    socket.emit("storedDatavolleyball", storedDatavolleyball);
    socket.emit("storedDatakabbadi", storedDatakabbadi);
    socket.emit("storedDatakhokho", storedDatakhokho);

    socket.on("updateScore", (data) => {
      try {
    
        if (data.gameId === "football") {
          io.emit("scoreUpdatedfootball", {
            gameId: data.gameId,
            scores: data.scores,
            teams: data.teams,
          });
          storedDatafootball=[];
          storedDatafootball.push({
            gameId: data.gameId,
            scores: data.scores,
            teams: data.teams,
          });
        } else if (data.gameId === "cricket") {
          io.emit("scoreUpdatedcricket", {
            gameId: data.gameId,
            scores: data.scores,
            teams: data.teams,
          });
          storedDatacricket=[];
          storedDatacricket.push({
            gameId: data.gameId,
            scores: data.scores,
            teams: data.teams,
          });
        } else if(data.gameId === "volleyball") {
          io.emit("scoreUpdatedvolleyball", {
            gameId: data.gameId,
            scores: data.scores,
            teams: data.teams,
          });
          storedDatavolleyball=[];
          storedDatavolleyball.push({
            gameId: data.gameId,
            scores: data.scores,
            teams: data.teams,
          });
        }else if(data.gameId === "kabbadi") {
          io.emit("scoreUpdatedkabbadi", {
            gameId: data.gameId,
            scores: data.scores,
            teams: data.teams,
          });
          storedDatakabbadi=[];
          storedDatakabbadi.push({
            gameId: data.gameId,
            scores: data.scores,
            teams: data.teams,
          });
        }else if(data.gameId === "khokho") {
          io.emit("scoreUpdatedkhokho", {
            gameId: data.gameId,
            scores: data.scores,
            teams: data.teams,
          });
          storedDatakhokho=[];
          storedDatakhokho.push({
            gameId: data.gameId,
            scores: data.scores,
            teams: data.teams,
          });
        }
      } catch (error) {
        console.error("Error emitting scoreUpdated event:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  //Wesocket

  server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});

module.exports = app;
