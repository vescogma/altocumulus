"use strict";

// src/index.ts
var import_functions_framework = require("@google-cloud/functions-framework");
var import_domain_1 = require("domain-1");
(0, import_functions_framework.cloudEvent)("functionTwo", async (event) => {
  console.log("dep test", (0, import_domain_1.getRandomName)(), (0, import_domain_1.getRandomColor)());
  console.log(event.id, event.type, event.source);
});
