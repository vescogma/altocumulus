// src/index.ts
import { http } from "@google-cloud/functions-framework";
import { getRandomDate } from "@ac/domain-two";
import { getRandomBS } from "@ac/domain-three";
http("domainTwoFunctionThree", async (req, res) => {
  console.log("dep test", getRandomDate(), getRandomBS());
  return res.send("success");
});
