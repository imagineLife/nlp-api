import getSentenceThemes from "./index.js";
import { buildThemes } from "../../themes.js";

describe("getSentenceThemes", () => {
  beforeAll(() => {
    buildThemes();
  });
  const sentences = [
    {
      s: "this income is about theme money",
      t: ["money"],
    },
    {
      s: "this income is about theme money and happy satisfaction",
      t: ["money", "satisfaction"],
    },
    {
      s: "this is about theme communication listen",
      t: ["communication"],
    },
  ];
  sentences.forEach((testObj) => {
    it(`from "${testObj.s}" gets theme ${testObj.t}`, () => {
      expect(JSON.stringify(getSentenceThemes(testObj.s))).toBe(
        JSON.stringify(testObj.t),
      );
    });
  });
});
