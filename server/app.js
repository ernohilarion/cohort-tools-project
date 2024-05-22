const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const PORT = 5005;
const cors = require("cors");
const mongoose = require("mongoose")
const Cohort = require("./models/cohort.model")
const Student = require("./models/student.model")

// STATIC DATA

const cohortsData = require("./cohorts.json")
const studentsData = require("./students.json")

// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();

// MIDDLEWARE
// Research Team - Set up CORS middleware here:
// ...
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:5005', 'http://localhost:5173']
}))

// DATABASE & MODELS

mongoose
  .connect("mongodb://127.0.0.1:27017/cohort-tools-api")
  .then(x => console.log(`Connected to Database: "${x.connections[0].name}"`))
  .catch(err => console.error("Error connecting to MongoDB", err));

// ROUTES

app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

// app.get("/api/cohorts", (req, res) => {
//   res.json(cohortsData)
// });

// app.get("/api/students", (req, res) => {
//   res.json(studentsData)
// });

//-----------ROUTE STUDENTS 
app.get("/api/students", (req, res) => {

  Student
    .find({})
    .populate("cohort")
    .then((students) => {
      console.log("Retrieved students ->", students)
      res.json(students)
    })
    .catch((error) => {
      console.error("Error while retrieving students ->", error)
      res.status(500).json({ error: "Failed to retrieve students" })
    })
})

app.post("/api/students", (req, res) => {

  const { firstName, lastName, email, phone, linkedinUrl, languages, program, background, image, cohort, projects } = req.body

  Student
    .create({ firstName, lastName, email, phone, linkedinUrl, languages, program, background, image, cohort, projects })
    .then(newStudent => res.sendStatus(201))
    .catch(err => res.json({ code: 500, errorDetails: err }))
})

app.get("/api/students/cohort/:cohortId", (req, res) => {

  const { cohortId } = req.params

  Student
    .find({ cohort: cohortId })
    .populate("cohort")
    .then(student => res.json(student))
    .catch(err => res.json({ code: 500, errorDetails: err }))
})

app.get("/api/students/:studentId", (req, res) => {

  const { studentId } = req.params

  Student
    .findById(studentId)
    .populate("cohort")
    .then(student => res.json(student))
    .catch(err => res.json({ code: 500, errorDetails: err }))
})

app.put("/api/students/:studentId", (req, res) => {

  const { studentId } = req.params

  const { firstName, lastName, email, phone, linkedinUrl, languages, program, background, image, cohort, projects } = req.body

  Student
    .findByIdAndUpdate(studentId, { firstName, lastName, email, phone, linkedinUrl, languages, program, background, image, cohort, projects })
    .then(editStudent => res.sendStatus(204))
    .catch(err => res.json({ code: 500, errorDetails: err }))
})

app.delete("/api/students/:studentId", (req, res) => {

  const { studentId } = req.params


  Student
    .findByIdAndDelete(studentId)
    .then(() => res.sendStatus(204))
    .catch(err => res.json({ code: 500, errorDetails: err }))
})


//-----------ROUTE COHORT 

app.get("/api/cohorts", (req, res) => {

  Cohort
    .find({})
    .then((cohorts) => {
      console.log("Retrieved cohorts ->", cohorts)
      res.json(cohorts)
    })
    .catch((error) => {
      console.error("Error while retrieving cohorts ->", error)
      res.status(500).json({ error: "Failed to retrieve cohorts" })
    })
})

app.post("/api/cohorts", (req, res) => {

  const { cohortSlug, cohortName, program, format, campus, startDate, endDate, inProgress, programManager, leadTeacher, totalHours } = req.body

  Cohort
    .create({ cohortSlug, cohortName, program, format, campus, startDate, endDate, inProgress, programManager, leadTeacher, totalHours })
    .then(newCohort => res.sendStatus(201))
    .catch(err => res.json({ code: 500, errorDetails: err }))
})


app.get("/api/cohorts/:cohortId", (req, res) => {

  const { cohortId } = req.params

  Cohort
    .findById(cohortId)
    .then(cohort => res.json(cohort))
    .catch(err => res.json({ code: 500, errorDetails: err }))
})

app.put("/api/cohorts/:cohortId", (req, res) => {

  const { cohortId } = req.params

  const { cohortSlug, cohortName, program, format, campus, startDate, endDate, inProgress, programManager, leadTeacher, totalHours } = req.body

  Cohort
    .findByIdAndUpdate(cohortId, { cohortSlug, cohortName, program, format, campus, startDate, endDate, inProgress, programManager, leadTeacher, totalHours })
    .then(editCohort => res.sendStatus(204))
    .catch(err => res.json({ code: 500, errorDetails: err }))
})


app.delete("/api/cohorts/:cohortId", (req, res) => {

  const { cohortId } = req.params

  Cohort
    .findByIdAndDelete(cohortId)
    .then(() => res.sendStatus(204))
    .catch(err => res.json({ code: 500, errorDetails: err }))
})








// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});