// src/index.ts
import { http } from "@google-cloud/functions-framework";
http("domainOneFunctionOne", async (req, res) => {
  return res.send("success");
});
