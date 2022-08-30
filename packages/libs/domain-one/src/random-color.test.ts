import { describe, test, expect, jest } from "@jest/globals";
import { faker } from "@faker-js/faker";
import { getRandomColor } from "./random-color.js";

jest.mock("@faker-js/faker");

const mocked = jest.mocked<typeof faker>(faker);

describe("random-color.test.ts", () => {
  test("returns a string", () => {
    mocked.color.human.mockImplementation(() => "hello");
    expect(getRandomColor()).toBe("hello");
  });
});
