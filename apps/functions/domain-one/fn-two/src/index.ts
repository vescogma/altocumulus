import { cloudEvent } from "@google-cloud/functions-framework";
import { getRandomName, getRandomColor } from "@ac/domain-one";

cloudEvent("domainOneFnTwo", async (event) => {
  console.log("dep test", getRandomName(), getRandomColor());
  console.log(event.id, event.type, event.source);
});
