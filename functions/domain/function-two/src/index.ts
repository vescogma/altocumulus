import { cloudEvent } from '@google-cloud/functions-framework'
import { getRandomName } from '@altocumulus/domain'

cloudEvent('functionTwo', async (event) => {
  console.log('dep test', getRandomName())
  console.log(event.id, event.type, event.source)
})
