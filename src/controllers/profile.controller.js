"use strict";
const { OK, CREATED } = require("../core/success.response");

const dataProfiles = [
  {
    usr_id: 1,
    usr_name: "CR7",
  },
  { usr_id: 2, usr_name: "M10" },
  { usr_id: 3, usr_name: "Nhat" },
];

class ProfileController {
  // admin
  profiles = async (req, res, next) => {
    OK(res, "view all profiles", dataProfiles);
  };

  // shop
  profile = async (req, res, next) => {
    OK(res, "view one profiles", { usr_id: 2, usr_name: "M10" });
  };
}

module.exports = new ProfileController();
