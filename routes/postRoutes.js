const express = require("express");

const postController = require("../controllers/postController");
const protect = require("../middleware/authMiddleware");
const router = express.Router();

//  locaclhost:3000/get
//  locaclhost:3000/post
//  "".post" code checks if user is signed in before doing anything.
router
  .route("/")
  .get(protect, postController.getAllPosts)
  .post(protect, postController.createPost);

router
  .route("/:id")
  .get(protect, postController.getOnePost)
  .patch(protect, postController.updatePost)
  .delete(protect, postController.deletePost);

module.exports = router;
