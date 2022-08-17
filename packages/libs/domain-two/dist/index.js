// src/random-date.ts
import { faker } from "@faker-js/faker";
var getRandomDate = () => {
  return faker.date.future();
};
export {
  getRandomDate
};
