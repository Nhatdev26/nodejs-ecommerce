"use strict";
const express = require("express");

const { asyncHandler } = require("../../helpers/async.handle");
const userController = require("../../controllers/user.controller");

const router = express.Router();

// admin
router.post("/new-user", asyncHandler(userController.newUser));
router.get("/verify-otp", asyncHandler(userController.checkLoginEmailToken));

module.exports = router;
