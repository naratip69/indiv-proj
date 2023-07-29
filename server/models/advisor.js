const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AdvisorSchema = new Schema(
  {
    first_name: { type: String, require: true },
    family_name: { type: String, require: true },
    academic_title: {
      type: String,
      require: true,
      enum: [
        "Professor",
        "Associate Professor",
        "Assistant Professor",
        "Lecturer",
      ],
      default: "Lecturer",
    },
    email: { type: String, require: true },
  },
  { toJSON: { virtuals: true } }
);

AdvisorSchema.virtual("name").get(function () {
  let fullname = "";
  if (this.first_name && this.family_name) {
    fullname = `${this.first_name} ${this.family_name}`;
  }
});

AdvisorSchema.virtual("url").get(function () {
  return `/info/advisor/${this._id}`;
});

module.exports = mongoose.model("Advisor", AdvisorSchema);
