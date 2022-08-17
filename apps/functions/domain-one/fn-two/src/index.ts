import { cloudEvent } from '@google-cloud/functions-framework'
import { getRandomName, getRandomColor } from 'domain-one'

cloudEvent('domainOneFunctionTwo', async (event) => {
  console.log('dep test', getRandomName(), getRandomColor())
  console.log(event.id, event.type, event.source)
})
