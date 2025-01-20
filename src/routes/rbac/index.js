const express = require("express");
const router = express.Router();
const rbacController = require("../../controllers/rbac.controller");
const { asyncHandler } = require("../../helpers/async.handle");

router.post("/resource", asyncHandler(rbacController.createResource));
router.get("/resources", asyncHandler(rbacController.getListResource));
router.post("/role", asyncHandler(rbacController.createRole));
router.get("/roles", asyncHandler(rbacController.getListRole));

module.exports = router;
