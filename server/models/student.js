const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StudentSchema = new Schema(
  {
    id: { type: String, require: true, minLength: 10, maxLength: 10 },
    first_name: { type: String, require: true },
    family_name: { type: String, require: true },
    academic_year: { type: Number, require: true },
    email: { type: String, require: true },
    tel: { type: String, minLength: 10, maxLength: 10, require: true },
    status: {
      type: String,
      require: true,
      enum: [
        "no Advisor",
        "have Adivsor",
        "done proposal exam",
        "finished exam",
        "graduated",
      ],
    },
    publications: [
      {
        title: { type: String, require: true },
        url: { type: String, require: true },
      },
    ],
    advisor: { type: Schema.Types.ObjectId, ref: "Advisor" },
  },
  { toJSON: { virtuals: true } }
);

StudentSchema.virtual("year_of_study").get(function () {
  const date = new Date();
  return date.getFullYear() - this.academic_year;
});

StudentSchema.virtual("name").get(function () {
  let fullname = "";
  if (this.first_name && this.family_name) {
    fullname = `${this.first_name} ${this.family_name}`;
  }
  return fullname;
});

StudentSchema.virtual("url").get(function () {
  return `/student/${this._id}`;
});

module.exports = mongoose.model("Student", StudentSchema);
