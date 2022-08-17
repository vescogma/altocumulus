"use strict";

// src/index.ts
var import_functions_framework = require("@google-cloud/functions-framework");
(0, import_functions_framework.http)("functionOne", async (req, res) => {
  return res.send("success");
});
