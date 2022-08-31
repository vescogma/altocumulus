import { http } from "@google-cloud/functions-framework";
import { getRandomDate } from "@ac/domain-two";
import { getRandomBS } from "@ac/domain-three";

http("domainTwoFnThree", async (req, res) => {
  return res.send(`${getRandomDate()}${getRandomBS()}`);
});
