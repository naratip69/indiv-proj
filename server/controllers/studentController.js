const Advisor = require("../models/advisor");
const Student = require("../models/student");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.student_list = asyncHandler(async (req, res, next) => {
  const status = req.body.status;
  const year_of_study = req.body.year_of_study;
  if (status && year_of_study) {
    const students = await Student.find(
      { status: status, year_of_study: year_of_study },
      { publications: 0 }
    ).exec();
    return res.json(students);
  } else if (status) {
    const students = await Student.find(
      { status: status },
      { publications: 0 }
    ).exec();
    return res.json(students);
  } else if (year_of_study) {
    const students = await Student.find(
      { year_of_study: year_of_study },
      { publications: 0 }
    ).exec();
    return res.json(students);
  }
  const students = await Student.find({}, { publications: 0 }).exec();
  return res.json(students);
});

exports.student_detail = asyncHandler(async (req, res, next) => {});
