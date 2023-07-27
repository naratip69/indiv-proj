const Advisor = require("../models/advisor");
const Student = require("../models/student");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.advisor_list = asyncHandler(async (req, res, next) => {
  const advisors = await Advisor.find().exec();
  res.json({ advisors: advisors });
});
