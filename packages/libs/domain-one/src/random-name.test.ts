import { describe, test, expect, jest } from "@jest/globals";
import { faker } from "@faker-js/faker";
import { getRandomName } from "./random-name.js";

jest.mock("@faker-js/faker");

const mocked = jest.mocked<typeof faker>(faker);

describe("random-name.test.ts", () => {
  test("returns a string", () => {
    mocked.name.firstName.mockImplementation(() => "hello");
    expect(getRandomName()).toBe("hello");
  });
});
