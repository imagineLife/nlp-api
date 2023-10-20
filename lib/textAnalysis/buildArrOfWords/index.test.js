import buildArrOfWords from "./index.js";

describe("buildArrOfWords", () => {
  it("works", () => {
    const input = "This is a sentence.";
    const res = buildArrOfWords(input);
    expect(res).toEqual(["This", "is", "a", "sentence"]);
  });
});
