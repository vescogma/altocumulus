// src/random-color.ts
import { faker } from "@faker-js/faker";
var getRandomColor = () => {
  return faker.color.human();
};
export {
  getRandomColor
};
