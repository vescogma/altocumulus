import { describe, test, expect, jest } from "@jest/globals";
import { faker } from "@faker-js/faker";
import { getRandomDate } from "./random-date.js";

jest.mock("@faker-js/faker");

const mocked = jest.mocked<typeof faker>(faker);

describe("random-date.ts", () => {
  test("returns a string", () => {
    const date = new Date()
    mocked.date.future.mockImplementation(() => date);
    expect(getRandomDate()).toBe(date);
  });
});
