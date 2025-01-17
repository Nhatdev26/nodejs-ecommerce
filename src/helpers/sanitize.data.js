"use strict";

function sanitizeData(data) {
  if (!data) return {};
  const sensitiveFields = ["password", "token"];
  const sanitizeData = { ...data };
  sensitiveFields.forEach((field) => {
    if (sanitizeData[field]) {
      sanitizeData[field] = "***REDACTED***";
    }
  });
  return sanitizeData;
}

module.exports = { sanitizeData };
