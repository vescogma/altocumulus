import { faker } from '@faker-js/faker'

export const getRandomDate = () => {
  return faker.date.future()
}
