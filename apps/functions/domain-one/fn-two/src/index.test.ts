import { describe, test, expect, jest } from "@jest/globals";
import { faker } from "@faker-js/faker";
import { CloudEventFunction } from "@google-cloud/functions-framework";
import { getFunction } from "@google-cloud/functions-framework/testing";
import { getRandomName, getRandomColor } from "@ac/domain-one";

import "./index.js";

jest.mock("@ac/domain-one");
jest.spyOn(console, "log");

const mockConsoleLog = jest.mocked(console.log);
const mockGetRandomName = jest.mocked(getRandomName);
const mockGetRandomColor = jest.mocked(getRandomColor);

describe("index.ts", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("dependencies called", async () => {
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

    expect(mockGetRandomName).toHaveBeenCalled();
    expect(mockGetRandomColor).toHaveBeenCalled();
  });

  test("event passed properly", async () => {
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

    expect(mockConsoleLog).toHaveBeenNthCalledWith(
      2,
      mockEvent.id,
      mockEvent.type,
      mockEvent.source
    );
  });
});
