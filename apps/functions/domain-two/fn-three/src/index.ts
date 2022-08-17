import { http } from '@google-cloud/functions-framework'
import { getRandomDate } from 'domain-two'
import { getRandomBS } from 'domain-three'

http('domainTwoFunctionThree', async (req, res) => {
  console.log('dep test', getRandomDate(), getRandomBS())
  return res.send('success')
})
