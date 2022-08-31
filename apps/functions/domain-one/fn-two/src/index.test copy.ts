import { describe, test, expect, jest } from "@jest/globals";
import { faker } from "@faker-js/faker";
import { CloudEventFunction } from "@google-cloud/functions-framework";
import { getFunction } from "@google-cloud/functions-framework/testing";

import "./index.js";

jest.spyOn(console, "log");

const mockConsoleLog = jest.mocked(console.log);

describe("index.ts", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("received event", async () => {
    const mockEvent = {
      id: faker.datatype.uuid(),
      specversion: faker.datatype.string(),
      source: faker.datatype.string(),
      type: faker.datatype.string(),
    };

    const cloudFunction = getFunction(
      "domainOneFnTwo"
    ) as CloudEventFunction<any>;
    await cloudFunction(mockEvent);

    expect(mockConsoleLog).toHaveBeenCalledWith(mockEvent.id);
  });
});
