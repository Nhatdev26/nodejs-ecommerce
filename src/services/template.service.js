"use strict";
const templateModel = require("../models/template.model");
const { htmlTemplateVerifyEmail } = require("../utils/template.html");

const newTemplate = async ({ tem_id = 0, tem_name, tem_html }) => {
  // 1. check template exist in database
  const template = await templateModel.findOne({ tem_name }).lean();
  if (template) {
    return new ConflictRequestError("Template already exist");
  }

  // 2. create new template
  const newTemplate = await templateModel.create({
    tem_id,
    tem_name, // unique
    tem_html: htmlTemplateVerifyEmail(),
  });

  return newTemplate;
};
const getTemplate = async ({ templateName }) => {
  const template = await templateModel
    .findOne({ tem_name: templateName })
    .lean();
  return template;
};

module.exports = { newTemplate, getTemplate };
