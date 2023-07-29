const express = require("express");
const router = express.Router();

const advisor_controller = require("../controllers/advisorController");
const student_controller = require("../controllers/studentController");

router.get("/students", student_controller.student_list);
router.post("/students", student_controller.student_list);

router.get("/student/create", student_controller.student_create_get);
router.post("/student/create", student_controller.student_create_post);

router.post("student/:id/delete", student_controller.student_delete_post);

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

router.get("student/:id", student_controller.student_detail);
