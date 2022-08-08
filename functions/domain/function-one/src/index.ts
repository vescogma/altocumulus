import { http } from '@google-cloud/functions-framework'

http('functionOne', async (req, res) => {
  return res.send('success')
})
