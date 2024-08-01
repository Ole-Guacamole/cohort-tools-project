const express = require("express");
const router = express.Router();
const Cohort = require("../models/Cohort.model"); // Adjust the path as necessary

///////////////////
/////////////////////////////////////////////////////
// // Cohort Routes

// POST /api/cohorts - Creates a new cohort

router.post("/cohorts", (req, res) => {
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

router.get("/cohorts", (req, res) => {
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

router.get("/cohorts/:cohortId", (req, res) => {
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

router.put("/cohorts/:cohortId", (req, res) => {
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

router.delete("/cohorts/:cohortId", (req, res) => {
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

//////////////////////
module.exports = router;
