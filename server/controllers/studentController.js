const Advisor = require("../models/advisor");
const Student = require("../models/student");
const db = require("mongodb");
const ObjectId = db.ObjectId;
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.student_list = asyncHandler(async (req, res, next) => {
  const students = await Student.find({}, { publications: 0 }).exec();
  res.json({ students: students });
});

exports.student_list_filter = asyncHandler(async (req, res, next) => {
  const status = req.body.status.toString();
  const year_of_study = req.body.year_of_study.toString();
  // console.log("test");
  if (status !== "undefined" && year_of_study) {
    const date = new Date();
    const students = await Student.find(
      { status: status, academic_year: date.getFullYear() - year_of_study },
      { publications: 0 }
    ).exec();
    res.json({ students: students });
  } else if (status !== "undefined") {
    const students = await Student.find(
      { status: status },
      { publications: 0 }
    ).exec();
    res.json({ students: students });
  } else if (year_of_study) {
    const date = new Date();
    const students = await Student.find(
      { academic_year: date.getFullYear() - year_of_study },
      { publications: 0 }
    ).exec();
    res.json({ students: students });
  } else {
    const students = await Student.find({}, { publications: 0 }).exec();
    res.json({ students: students });
  }
});

exports.student_detail = asyncHandler(async (req, res, next) => {
  // console.log(req);
  const student = await Student.findOne({ id: req.params.id })
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
  res.json({ advisors: allAdvisors });
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
  body("id", "Student ID must have 10 digit")
    .trim()
    .isLength({ min: 10, max: 10 })
    .escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    // console.log(req.body);
    // console.log(errors);
    const student = new Student({
      id: req.body.id,
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      academic_year: req.body.academic_year,
      email: req.body.email,
      tel: req.body.tel,
      status: req.body.status,
      publications: [],
    });
    // console.log(student);
    if (req.body.advisor) {
      student.advisor = req.body.advisor;
    }
    // console.log(student);

    if (!errors.isEmpty()) {
      const allAdvisors = await Advisor.find().exec();
      res.json({
        advisors: allAdvisors,
        student: student,
        errors: errors.array(),
      });
    } else {
      const newStudent = await student.save();
      // console.log(newStudent);
      res.json(newStudent);
    }
  }),
];

exports.student_delete_post = asyncHandler(async (req, res, next) => {
  const student = await Student.findOne({ id: req.params.id }).exec();
  if (student === null) {
    const err = new Error("Student not found");
    err.status = 404;
    return next(err);
  }
  await Student.findByIdAndDelete(student._id);
  res.json(student);
});

exports.student_update_get = asyncHandler(async (req, res, next) => {
  const [student, allAdvisors] = await Promise.all([
    Student.findOne({ id: req.params.id }).exec(),
    Advisor.find().exec(),
  ]);

  if (student === null) {
    const err = new Error("Student not found");
    err.status = 404;
    return next(err);
  }

  res.json({
    student: student,
    advisors: allAdvisors,
  });
});

exports.student_update_post = [
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

    const old_student = await Student.findOne(
      { id: req.params.id },
      { publications: 1 }
    ).exec();

    const student = new Student({
      _id: old_student._id,
      id: req.body.id,
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      academic_year: req.body.academic_year,
      email: req.body.email,
      tel: req.body.tel,
      status: req.body.status,
      publications: old_student.publications,
    });
    if (req.body.advisor && req.body.status !== "no Advisor") {
      student.advisor = req.body.advisor;
    } else if (req.body.status === "no Advisor") {
      student.advisor = null;
    }
    // console.log(req.body);
    // console.log(old_student);
    // console.log(student);
    // console.log(errors);

    if (!errors.isEmpty()) {
      const allAdvisors = Advisor.find().exec();

      res.json({
        student: student,
        advisors: allAdvisors,
        errors: errors.array(),
      });
    } else {
      const update_student = await Student.findByIdAndUpdate(
        old_student._id,
        student,
        {}
      );
      res.json(update_student);
    }
  }),
];

exports.student_add_publication = [
  body("title", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("url", "Link must not be empty").trim().isLength({ min: 1 }).escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.json({ errors: errors.array() });
    }

    // console.log(req.body);
    const student = await Student.findOne({ id: req.params.id }).exec();
    const new_publication = { title: req.body.title, url: req.body.url };
    const new_publications = [...student.publications, new_publication];
    // console.log(student, new_publication, new_publications);
    student.publications = new_publications;
    await Student.findByIdAndUpdate({ _id: student._id }, student, {});
    const out = await Student.findOne(
      { id: req.params.id },
      { publications: 1 }
    ).exec();
    res.json(out.publications);
  }),
];

exports.student_remove_publication = [
  body("title", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.json({ errors: errors.array() });
    }

    console.log(req.body);

    const student = await Student.findOne({ id: req.params.id }).exec();
    const new_publications = student.publications.filter(
      (e) => e.title !== req.body.title
    );

    await Student.updateOne(
      { _id: student._id },
      { $set: { publications: new_publications } }
    );

    const out = await Student.findOne(
      { id: req.params.id },
      { publications: 1 }
    ).exec();
    res.json(out.publications);
  }),
];

exports.student_enroll_get = asyncHandler(async (req, res, next) => {
  const students = await Student.find({}, { academic_year: 1 })
    .sort({ academic_year: 1 })
    .exec();
  let stat = {};

  if (students === null) {
    const err = new Error("Students not found");
    err.status = 404;
    return next(err);
  }
  students.map((e) => {
    stat[e.academic_year] = stat[e.academic_year]
      ? stat[e.academic_year] + 1
      : 1;
  });
  stat.total = students.length;
  res.json(stat);
});

exports.student_graduated_get = asyncHandler(async (req, res, next) => {
  const students = await Student.find(
    { status: "graduated" },
    { academic_year: 1 }
  )
    .sort({ academic_year: 1 })
    .exec();
  let stat = {};

  if (students === null) {
    const err = new Error("Students not found");
    err.status = 404;
    return next(err);
  }
  students.map((e) => {
    stat[e.academic_year] = stat[e.academic_year]
      ? stat[e.academic_year] + 1
      : 1;
  });
  stat.total = students.length;
  res.json(stat);
});

exports.student_notGraduatedIn2_get = asyncHandler(async (req, res, next) => {
  const date = new Date();
  const filter = date.getFullYear() - 2;
  const students = await Student.find(
    { academic_year: { $lt: filter } },
    { academic_year: 1 }
  )
    .sort({ academic_year: 1 })
    .exec();
  let stat = {};

  if (students === null) {
    const err = new Error("Students not found");
    err.status = 404;
    return next(err);
  }
  students.map((e) => {
    stat[e.academic_year] = stat[e.academic_year]
      ? stat[e.academic_year] + 1
      : 1;
  });
  stat.total = students.length;
  res.json(stat);
});
