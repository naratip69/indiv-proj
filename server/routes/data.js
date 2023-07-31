const express = require("express");
const router = express.Router();

const advisor_controller = require("../controllers/advisorController");
const student_controller = require("../controllers/studentController");

router.get("/", function (req, res, next) {
  res.redirect("/students");
});

router.get("/students", student_controller.student_list);
router.post("/students", student_controller.student_list_filter);

router.get("/student/create", student_controller.student_create_get);
router.post("/student/create", student_controller.student_create_post);

router.post("/student/:id/delete", student_controller.student_delete_post);

router.get("/student/:id/update", student_controller.student_update_get);
router.post("/student/:id/update", student_controller.student_update_post);

router.post(
  "/student/:id/addPublication",
  student_controller.student_add_publication
);
router.post(
  "/student/:id/removePublication",
  student_controller.student_remove_publication
);

router.get("/student/:id", student_controller.student_detail);

router.get("/advisors", advisor_controller.advisor_list);

router.post("/advisor/create", advisor_controller.advisor_create_post);

router.get("/advisor/:id/delete", advisor_controller.advisor_delete_get);
router.post("/advisor/:id/delete", advisor_controller.advisor_delete_post);

router.get("/advisor/:id/update", advisor_controller.advisor_update_get);
router.post("/advisor/:id/update", advisor_controller.advisor_update_post);

router.get("/advisor/:id", advisor_controller.advisor_detail);

module.exports = router;
