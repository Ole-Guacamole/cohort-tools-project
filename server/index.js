const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const PORT = 5005;

// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
// ...
// const students = require("./students.json");
// const cohorts = require("./cohorts.json");

// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();

//Connecting to MongoDB via mongoose

mongoose
  .connect("mongodb://127.0.0.1:27017/cohort-tools-api")
  .then((x) => console.log(`Connected to Database: "${x.connections[0].name}"`))
  .catch((err) => console.error("Error connecting to MongoDB", err));

//Import Mongoose Models
const Cohort = require("./models/Cohort.model");
const Student = require("./models/Student.model");

// MIDDLEWARE
// Research Team - Set up CORS middleware here:
// ...
// Use the CORS middleware with options to allow requests
// from specific IP addresses and domains.
app.use(
  cors({
    // Add the URLs of allowed origins to this array
    origin: ["http://localhost:5173"],
  })
);
app.use(express.json()); // parse data to server site
app.use(morgan("dev")); // logging requests
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// 👇 Start handling routes here

const allRoutes = require("./routes/index.routes");
app.use("/api", allRoutes);

const studentRouter = require("./routes/student.routes"); // <== IMPORT
app.use("/api", studentRouter); // <== ADD

const cohortRouter = require("./routes/cohort.routes"); // <== IMPORT
app.use("/api", cohortRouter); // <== ADD

app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on: http://localhost:${PORT}`);
});
