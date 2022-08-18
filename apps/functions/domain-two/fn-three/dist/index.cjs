"use strict";

// src/index.ts
var import_functions_framework = require("@google-cloud/functions-framework");
var import_domain_two = require("@ac/domain-two");
var import_domain_three = require("@ac/domain-three");
(0, import_functions_framework.http)("domainTwoFunctionThree", async (req, res) => {
  console.log("dep test", (0, import_domain_two.getRandomDate)(), (0, import_domain_three.getRandomBS)());
  return res.send("success");
});
