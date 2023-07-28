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

exports.student_detail = asyncHandler(async (req, res, next) => {
  const student = await Student.findById(req.params.id)
    .populate("advisor")
    .exec();

  if (student === null) {
    const err = new Error("Student not found");
    err.status = 404;
    return next(err);
  }

  res.json(student);
});

exports.student_create_get = asyncHandler(async (req, res, next) => {
  const allAdvisors = await Advisor.find().exec();
  res.json(allAdvisors);
});

exports.student_create_post = [
  body("first_name", "First name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("family_name", "Family name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("academic_year", "Academic year must not be empty.").trim().escape(),
  body("email", "Email is not valid").trim().isEmail().escape(),
  body("tel", "Phone number must not be empty.")
    .trim()
    .isMobilePhone()
    .escape(),
  body("status.*").escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const student = new Student({
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      academic_year: req.body.academic_year,
      email: req.body.email,
      tel: req.body.tel,
      status: req.body.status,
    });
    if (req.body.advisor !== "undefined") student.advisor = req.body.advisor;

    if (!errors.isEmpty()) {
      const allAdvisors = await Advisor.find.exec();
      res.json({
        advisors: allAdvisors,
        student: student,
        errors: errors,
      });
    } else {
      await student.save();
      res.json(student);
    }
  }),
];

exports.student_delete_post = asyncHandler(async (req, res, next) => {
  const student = await Student.findById(req.params.id).exec();
  if (student === null) {
    const err = new Error("Student not found");
    err.status = 404;
    return next(err);
  }
  await Student.findByIdAndDelete(req.params.id);
  res.json(student);
});
