import { describe, test, expect, jest } from "@jest/globals";
import { faker } from "@faker-js/faker";
import { getRandomBS } from "./random-bs.js";

jest.mock("@faker-js/faker");

const mocked = jest.mocked<typeof faker>(faker);

describe("random-bs.ts", () => {
  test("returns a string", () => {
    mocked.company.bs.mockImplementation(() => "hello");
    expect(getRandomBS()).toBe("hello");
  });
});
