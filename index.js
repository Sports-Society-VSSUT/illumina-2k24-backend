// server.js

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const socketIO = require("socket.io");

const route1 = require("./Routes/medals");
const route2 = require("./Routes/medal_data");

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let dbConnection;
let storedData = []; // Array to store data

const connectToDb = (cb) => {
  mongoose
    .connect("mongodb://127.0.0.1:27017/medal_input", {
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

const port = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(cors());

connectToDb((err) => {
  if (err) {
    console.error("Error occurred while connecting to the database:", err);
    return;
  }
  console.log("Connected successfully to the database");

  app.use("/", route1);
  app.use("/", route2);

  app.get("/getStoredDatafootball", (req, res) => {
    res.json(storedDatafootball);
  });

  app.get("/getStoredDatacricket", (req, res) => {
    res.json(storedDatacricket);
  });

  app.get("/getStoredDataVball", (req, res) => {
    res.json(storedDataVball);
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
      storedDataVball = []; 
      storedDatakabbadi=[];
      storedDatakhokho=[];
  
      res.json({ success: true, message: "Stored data deleted successfully." });
    } catch (error) {
      console.error("Error deleting stored data:", error);
      res.status(500).json({ success: false, message: "Internal server error." });
    }
  });

  let storedDatafootball = [];
  let storedDatacricket = [];
  let storedDataVball = [];
  let storedDatakhokho=[];
  let storedDatakabbadi=[];

  io.on("connection", (socket) => {
    console.log("A user connected");
    socket.emit("storedDatafootball", storedDatafootball);
    socket.emit("storedDatacricket", storedDatacricket);
    socket.emit("storedDataVball", storedDataVball);
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
          storedDataVball=[];
          storedDataVball.push({
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

  server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});

module.exports = app;
