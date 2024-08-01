// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();
const express = require("express");
// ℹ️ Connects to the database
const app = express();
require("./db");


// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express

// const morgan = require("morgan");
// const cookieParser = require("cookie-parser");

// const mongoose = require("mongoose");
// const PORT = process.env.PORT || 5005;

// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express

require("./config")(app);
// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware


//Connecting to MongoDB via mongoose

// mongoose
//   .connect("mongodb://127.0.0.1:27017/cohort-tools-api")
//   .then((x) => console.log(`Connected to Database: "${x.connections[0].name}"`))
//   .catch((err) => console.error("Error connecting to MongoDB", err));

//Import Mongoose Models
// const Cohort = require("./models/Cohort.model");
// const Student = require("./models/Student.model");

//app.use(express.json()); // parse data to server site
// app.use(morgan("dev")); // logging requests
//app.use(express.static("public"));
//app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());

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

module.exports = app;
// START SERVER
// app.listen(PORT, () => {
//   console.log(`Server listening on: http://localhost:${PORT}`);
// });
