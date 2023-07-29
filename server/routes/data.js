const express = require("express");
const router = express.Router();

const advisor_controller = require("../controllers/advisorController");
const student_controller = require("../controllers/studentController");

router.get("/students", student_controller.student_list);
