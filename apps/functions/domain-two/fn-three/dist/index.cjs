"use strict";

// src/index.ts
var import_functions_framework = require("@google-cloud/functions-framework");
var import_domain_2 = require("domain-2");
(0, import_functions_framework.http)("functionOne", async (req, res) => {
  console.log("dep test", (0, import_domain_2.getRandomDate)());
  return res.send("success");
});
