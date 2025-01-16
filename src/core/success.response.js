"use strict";

const { StatusCodes, ReasonPhrases } = require("./httpStatusCode");
class SuccessResponse {
  constructor(message, status = StatusCodes.OK, data = {}) {
    (this.message = message), (this.status = status), (this.data = data);
  }

  send(res, header = {}) {
    return res.status(this.status).json(this);
  }
}

class Ok extends SuccessResponse {
  constructor(message, data = {}) {
    super(message, StatusCodes.OK, data);
  }
}

const OK = (res, message, data) => {
  new Ok(message, data).send(res);
};

class Created extends SuccessResponse {
  constructor(message, data = {}) {
    super(message, StatusCodes.CREATED, data);
  }
}

const CREATED = (res, message, data) => {
  new Created(message, data).send(res);
};

module.exports = { OK, CREATED };
