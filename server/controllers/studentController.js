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
    res.json({ students: students });
  } else if (status) {
    const students = await Student.find(
      { status: status },
      { publications: 0 }
    ).exec();
    res.json({ students: students });
  } else if (year_of_study) {
    const students = await Student.find(
      { year_of_study: year_of_study },
      { publications: 0 }
    ).exec();
    res.json({ students: students });
  } else {
    const students = await Student.find({}, { publications: 0 }).exec();
    res.json({ students: students });
  }
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
  body("id", "Student ID must have 10 digit")
    .trim()
    .isLength({ min: 10, max: 10 })
    .escape(),
  body("status.*").escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const student = new Student({
      _id: ObjectId(req.body.id),
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      academic_year: req.body.academic_year,
      email: req.body.email,
      tel: req.body.tel,
      status: req.body.status,
      publications: [],
    });
    if (req.body.advisor !== "undefined") student.advisor = req.body.advisor;

    if (!errors.isEmpty()) {
      const allAdvisors = await Advisor.find.exec();
      res.json({
        advisors: allAdvisors,
        student: student,
        errors: errors.array(),
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

exports.student_update_get = asyncHandler(async (req, res, next) => {
  const [student, allAdvisors] = await Promise.all([
    Student.findById(req.params.id).populate("advisor").exec(),
    Advisor.find().exec(),
  ]);

  if (student === null) {
    const err = new Error("Student not found");
    err.status = 404;
    return next(err);
  }

  res.json({
    student: student,
    advisor: allAdvisors,
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

    const old_student = await Student.find(
      { _id: req.params.id },
      { publications: 1 }
    ).exec();

    const student = new Student({
      _id: old_student._id,
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      academic_year: req.body.academic_year,
      email: req.body.email,
      tel: req.body.tel,
      status: req.body.status,
      publications: old_student.publications,
    });

    if (req.body.advisor) student.advisor = req.body.advisor;

    if (!errors.isEmpty()) {
      const allAdvisors = Advisor.find().exec();

      res.json({
        student: student,
        advisors: allAdvisors,
        errors: errors.array(),
      });
    } else {
      const update_student = await Student.findByIdAndUpdate(
        req.params.id,
        student,
        {}
      );
      req.json(update_student);
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

    const student = await Student.findById(req.params.id).exec();
    const new_publication = { title: req.body.title, url: req.body.url };
    const new_publications = [...student.publications, new_publication];

    await Student.updateOne(
      { _id: req.params.id },
      { $set: { publications: new_publications } }
    );

    res.json(student);
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

    const student = await Student.findById(req.params.id).exec();
    const new_publication = { title: req.body.title, url: req.body.url };
    const new_publications = student.publications.filter(
      (e) => e.title !== req.body.title
    );

    await Student.updateOne(
      { _id: req.params.id },
      { $set: { publications: new_publications } }
    );

    res.json(student);
  }),
];
