// src/index.ts
import { http } from "@google-cloud/functions-framework";
import { getRandomDate } from "domain-2";
http("functionOne", async (req, res) => {
  console.log("dep test", getRandomDate());
  return res.send("success");
});
