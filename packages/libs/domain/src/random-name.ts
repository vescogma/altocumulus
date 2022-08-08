import { faker } from '@faker-js/faker'

export const getRandomName = () => {
  return faker.name.firstName()
}