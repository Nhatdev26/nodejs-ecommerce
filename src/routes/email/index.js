"use strict";
const express = require("express");
const emailController = require("../../controllers/email.controller");
const { asyncHandler } = require("../../helpers/async.handle");

const router = express.Router();

// admin
router.post("/new-template", asyncHandler(emailController.newTemplate));

module.exports = router;
