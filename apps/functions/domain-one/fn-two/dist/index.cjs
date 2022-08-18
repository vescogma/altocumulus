"use strict";

// src/index.ts
var import_functions_framework = require("@google-cloud/functions-framework");
var import_domain_one = require("@ac/domain-one");
(0, import_functions_framework.cloudEvent)("domainOneFunctionTwo", async (event) => {
  console.log("dep test", (0, import_domain_one.getRandomName)(), (0, import_domain_one.getRandomColor)());
  console.log(event.id, event.type, event.source);
});
