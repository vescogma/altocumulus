import { faker } from '@faker-js/faker'

export const getRandomColor = () => {
  return faker.color.human()
}
