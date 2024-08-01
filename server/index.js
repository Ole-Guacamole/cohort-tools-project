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

// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:

// Get cohorts from json
// app.get("/api/cohorts", (req, res) => {
//   res.json(cohorts);
// });


// STUDENTS ROUTES

// POST /api/students - Creates a new student

app.post("/api/students", (req, res) => {
  Student.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phone: req.body.phone,
    linkedinUrl: req.body.linkedinUrl,
    languages: req.body.languages,
    program: req.body.program,
    background: req.body.background,
    image: req.body.image,
    projects: req.body.projects,
    cohort: req.body.cohort,
  })
    .then((createdStudent) => {
      console.log("Student created ->", createdStudent);
      res.status(201).json(createdStudent);
    })
    .catch((error) => {
      console.error("Error while creating student ->", error);
      res.status(500).json({ error: "Failed to create student" });
    });
});

// GET /api/students - Retrieves all of the students in the database collection

app.get("/api/students", (req, res) => {
  Student.find({})
    .populate("cohort")
    .then((students) => {
      console.log("Retrieved students ->", students);
      res.json(students);
    })
    .catch((error) => {
      console.error("Error while retrieving students ->", error);
      res.status(500).json({ error: "Failed to retrieve students" });
    });
});

// GET /api/students/cohort/:cohortId - Retrieves all of the students for a given cohort

app.get("/api/students/cohort/:cohortId", (req, res) => {
  const cohortId = req.params.cohortId;

  Student.find({ cohort: cohortId })
    .populate("cohort")
    .then((students) => {
      console.log("Retrieved students for cohort ->", cohortId, students);
      res.json(students);
    })
    .catch((error) => {
      console.error("Error while retrieving students for cohort ->", error);
      res.status(500).json({ error: "Failed to retrieve students for cohort" });
    });
});

// GET /api/students/:studentId - Retrieves a specific student by id

app.get("/api/students/:studentId", (req, res) => {
  const studentId = req.params.studentId;

  Student.findById(studentId)
    .populate("cohort")
    .then((student) => {
      if (student) {
        console.log("Retrieved student ->", student);
        res.json(student);
      } else {
        res.status(404).json({ error: "Student not found" });
      }
    })
    .catch((error) => {
      console.error("Error while retrieving student ->", error);
      res.status(500).json({ error: "Failed to retrieve student" });
    });
});

// PUT /api/students/:studentId - Updates a specific student by id

app.put("/api/students/:studentId", (req, res) => {
  const studentId = req.params.studentId;

  Student.findByIdAndUpdate(studentId, req.body, { new: true })
    .then((updatedStudent) => {
      console.log("Updated student ->", updatedStudent);

      res.status(204).json(updatedStudent);
    })
    .catch((error) => {
      console.error("Error while updating student ->", error);
      res.status(500).json({ error: "Failed to update student" });
    });
});

// DELETE /api/students/:studentId - Deletes a specific student by id

app.delete("/api/students/:studentId", (req, res) => {
  Student.findByIdAndDelete(req.params.studentId)
    .then((result) => {
      console.log("Student deleted!");
      res.status(204).send();
    })
    .catch((error) => {
      console.error("Error while deleting Student ->", error);
      res.status(500).json({ error: "Deleting Student failed" });
    });
});

//////////////////////////////////////////////////////
// // Cohort Routes

// POST /api/cohorts - Creates a new cohort

app.post("/api/cohorts", (req, res) => {
  Cohort.create({
    cohortSlug: req.body.cohortSlug,
    cohortName: req.body.cohortName,
    format: req.body.format,
    campus: req.body.campus,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    inProgress: req.body.inProgress,
    programManager: req.body.programManager,
    leadTeacher: req.body.leadTeacher,
    totalHours: req.body.totalHours,
  })
    .then((createdCohort) => {
      console.log("Cohort created ->", createdCohort);
      res.status(201).json(createdCohort);
    })
    .catch((error) => {
      console.error("Error while creating the cohort ->", error);
      res.status(500).json({ error: "Failed to create cohort" });
    });
});

// GET /api/cohorts - Retrieves all of the cohorts in the database collection

app.get("/api/cohorts", (req, res) => {
  Cohort.find({})
    .then((cohorts) => {
      console.log("Retrieved cohorts ->", cohorts);

      res.status(200).json(cohorts);
    })
    .catch((error) => {
      console.error("Error while retrieving cohorts ->", error);
      res.status(500).json({ error: "Failed to retrieve cohorts" });
    });
});


// GET /api/cohorts/:cohortId - Retrieves a specific cohort by id

app.get("/api/cohorts/:cohortId", (req, res) => {
  const cohortId = req.params.cohortId;

  Cohort.findById(cohortId)
    .then((cohort) => {
      if (cohort) {
        console.log("Retrieved cohort ->", cohort);
        res.json(cohort);
      } else {
        res.status(404).json({ error: "Cohort not found" });
      }
    })
    .catch((error) => {
      console.error("Error while retrieving cohort ->", error);
      res.status(500).json({ error: "Failed to retrieve cohort" });
    });
});

// PUT /api/cohorts/:cohortId - Updates a specific cohort by id

app.put("/api/cohorts/:cohortId", (req, res) => {
  const cohortId = req.params.cohortId;

  Cohort.findByIdAndUpdate(cohortId, req.body, { new: true })
    .then((updatedCohort) => {
      console.log("Updated cohort ->", updatedCohort);

      res.status(204).json(updatedCohort);
    })
    .catch((error) => {
      console.error("Error while updating cohort ->", error);
      res.status(500).json({ error: "Failed to update cohort" });
    });
});

// DELETE /api/cohorts/:cohortId - Deletes a specific cohort by id

app.delete("/api/cohorts/:cohortId", (req, res) => {
  Cohort.findByIdAndDelete(req.params.cohortId)
    .then((result) => {
      console.log("Cohort deleted!");
      res.status(204).send();
    })
    .catch((error) => {
      console.error("Error while deleting Cohort ->", error);
      res.status(500).json({ error: "Deleting Cohort failed" });
    });
});

// ...
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on: http://localhost:${PORT}`);
});
