// src/random-name.ts
import { faker } from "@faker-js/faker";
var getRandomName = () => {
  return faker.name.firstName();
};
export {
  getRandomName
};
