const express = require("express");
const router = express.Router();

const { BadRequestError } = require("../core/error.response");

const { asyncHandler } = require("../helpers/async.handle");
const { apiKey, permission } = require("../auth/checkAuth");

// check api key
router.use(apiKey);

// check permission
router.use(permission("0000"));

router.use("/v1/api", require("./access/index"));

module.exports = router;
