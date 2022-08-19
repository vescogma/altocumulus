import { http } from "@google-cloud/functions-framework";

http("domainOneFnOne", async (req, res) => {
  return res.send("success");
});
