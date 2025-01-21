"use strict";

const { CREATED } = require("../core/success.response");
const { newTemplate } = require("../services/template.service");

class EmailController {
  newTemplate = async (req, res, next) => {
    CREATED(res, "Create New Template Success", await newTemplate(req.body));
  };
}

module.exports = new EmailController();
