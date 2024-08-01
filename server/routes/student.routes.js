const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");

const Student = require("../models/Student.model");
// STUDENTS ROUTES

// POST /api/students - Creates a new student

router.post("/students", (req, res) => {
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

router.get("/students", (req, res) => {
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

router.get("/students/cohort/:cohortId", (req, res) => {
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

router.get("/students/:studentId", (req, res) => {
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

router.put("/students/:studentId", (req, res) => {
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

router.delete("/students/:studentId", (req, res) => {
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

module.exports = router;
