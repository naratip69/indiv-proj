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
    const err = new Error("Book not found");
    err.status = 404;
    return next(err);
  }
  res.json({ advisor: advisor, students: students });
});
