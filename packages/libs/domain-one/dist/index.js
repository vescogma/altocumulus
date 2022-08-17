// src/random-name.ts
import { faker } from "@faker-js/faker";
var getRandomName = () => {
  return faker.name.firstName();
};

// src/random-color.ts
import { faker as faker2 } from "@faker-js/faker";
var getRandomColor = () => {
  return faker2.color.human();
};
export {
  getRandomColor,
  getRandomName
};
