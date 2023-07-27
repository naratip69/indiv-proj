const Advisor = require("../models/advisor");
const Student = require("../models/student");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.advisor_list = asyncHandler(async (req, res, next) => {
  const advisors = await Advisor.find().exec();
  res.json({ advisors: advisors });
});

exports.advisor_detail = asyncHandler(async (req, res, next) => {
  const [advisor, students] = await Promise.all([
    Advisor.findById(req.params.id).exec(),
    Student.find(
      { advisor: req.params.id },
      { publications: 0, status: 0, advisor: 0 }
    ).exec(),
  ]);

  if (advisor === null) {
    const err = new Error("Advisor not found");
    err.status = 404;
    return next(err);
  }
  res.json({ advisor: advisor, students: students });
});

exports.advisor_create_post = [
  body("first_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("First name must be specified.")
    .isAlphanumeric()
    .withMessage("First name has non-alphanumeric characters."),
  body("family_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Family name must be specified.")
    .isAlphanumeric()
    .withMessage("Family name has non-alphanumeric characters."),
  body("email").trim().isEmail().escape().withMessage("invalid email"),
  body("academic_title.*").escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const advisor = new Advisor({
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      email: req.body.email,
      academic_title: req.body.academic_title,
    });

    if (!errors.isEmpty()) {
      res.json({
        advisor: advisor,
        errors: errors.array(),
      });
    } else {
      await advisor.save();
      res.json({
        advisor: advisor,
      });
    }
  }),
];

exports.advisor_delete_get = asyncHandler(async (req, res, next) => {
  const [advisor, studentsInAdvised] = await Promise.all([
    Advisor.findById(req.body.id).exec(),
    Student.find({ advisor: req.params.id }, { status: 1, advisor: 1 }).exec(),
  ]);

  res.json({
    advisor: advisor,
    studentsInAdvised: studentsInAdvised,
  });
});

exports.advisor_delete_post = asyncHandler(async (req, res, next) => {
  const [advisor, studentsInAdvised] = await Promise.all([
    Advisor.findById(req.body.id).exec(),
    Student.find({ advisor: req.params.id }, { status: 1, advisor: 1 }).exec(),
  ]);

  for (let student of studentsInAdvised) {
    if (student.status === "have Advisor") {
      await Student.updateOne(
        { _id: student._id },
        { $set: { status: "no Advisor", advisor: undefined } }
      );
    } else {
      await Student.updateOne(
        { _id: student._id },
        { $set: { advisor: undefined } }
      );
    }
  }

  await Advisor.findByIdAndDelete(req.params.id);
  res.json(advisor);
});

exports.advisor_update_get = asyncHandler(async (req, res, next) => {
  const advisor = await Advisor.findById(req.params.id).exec();

  if (advisor === null) {
    const err = new Error("Advisor not found");
    err.status = 404;
    return next(err);
  }

  res.json(advisor);
});

exports.advisor_update_post = [
  body("first_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("First name must be specified.")
    .isAlphanumeric()
    .withMessage("First name has non-alphanumeric characters."),
  body("family_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Family name must be specified.")
    .isAlphanumeric()
    .withMessage("Family name has non-alphanumeric characters."),
  body("email").trim().isEmail().escape().withMessage("invalid email"),
  body("academic_title.*").escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const advisor = new Advisor({
      _id: req.params.id,
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      academic_title: req.body.academic_title,
      email: req.body.email,
    });

    if (!errors.isEmpty()) {
      res.json({
        advisor: advisor,
        errors: errors.array(),
      });
    } else {
      const update_advisor = await Advisor.findByIdAndUpdate(
        req.params.id,
        advisor,
        {}
      );
      res.json(update_advisor);
    }
  }),
];
