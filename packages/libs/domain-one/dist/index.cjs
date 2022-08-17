"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  getRandomColor: () => getRandomColor,
  getRandomName: () => getRandomName
});
module.exports = __toCommonJS(src_exports);

// src/random-name.ts
var import_faker = require("@faker-js/faker");
var getRandomName = () => {
  return import_faker.faker.name.firstName();
};

// src/random-color.ts
var import_faker2 = require("@faker-js/faker");
var getRandomColor = () => {
  return import_faker2.faker.color.human();
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getRandomColor,
  getRandomName
});
