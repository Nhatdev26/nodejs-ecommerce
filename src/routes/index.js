const express = require("express");
const router = express.Router();

const { BadRequestError } = require("../core/error.response");

const { asyncHandler } = require("../helpers/async.handle");
const { apiKey, permission } = require("../auth/checkAuth");
const { COLLECTION_NAME } = require("../models/resource.model");

// check api key
router.use(apiKey);

// check permission
router.use(permission("0000"));
router.use("/v1/api/profile", require("./profile/index"));
router.use("/v1/api/email", require("./email/index"));
router.use("/v1/api/user", require("./user/index"));

router.use("/v1/api/rbac", require("./rbac/index"));
router.use("/v1/api", require("./access/index"));

module.exports = router;
