const express = require("express");
const router = express.Router();
const accessController = require("../../controllers/access.controller");
const { asyncHandler } = require("../../helpers/async.handle");
const { authentication } = require("../../auth/authUtils");
const {
  validateLoginRequest,
  validateRegister,
} = require("../../middlewares/validators/access.validator");

router.post(
  "/shops/register",
  validateRegister,
  asyncHandler(accessController.signUp)
);
router.post(
  "/shops/login",
  validateLoginRequest,
  asyncHandler(accessController.login)
);

// *******authentication********//
router.use(authentication);

router.post("/shops/logout", asyncHandler(accessController.logout));
router.post(
  "/shops/refresh-token",
  asyncHandler(accessController.refreshToken)
);

module.exports = router;
