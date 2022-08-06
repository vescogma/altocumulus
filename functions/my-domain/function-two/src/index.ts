import { cloudEvent } from '@google-cloud/functions-framework'

cloudEvent('functionTwo', async (event) => {
  console.log(event.id, event.type, event.source)
})
