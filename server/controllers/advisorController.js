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
