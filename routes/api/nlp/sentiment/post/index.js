async function getTextStats(text) {
  const {
    buildArrOfSentences,
    buildArrOfWords,
    convertStringToArr,
    getLongestThirty,
    getLongestWord,
    getSentenceThemes,
    getWordsByCount,
    setupNLPTools,
  } = await import("../../../../../lib/index.js");

  const entireArray = convertStringToArr(text);
  const wordsByCount = getWordsByCount(entireArray);
  const longestThirty = getLongestThirty(entireArray);
  const sentences = buildArrOfSentences(text);

  let sentenceArr = [];
  let internalSummary = {
    sentences: 0,
    words: 0,
    sentiments: {
      positive: {
        count: 0,
        percent: 0,
      },
      negative: {
        count: 0,
        percent: 0,
      },
      neutral: {
        count: 0,
        percent: 0,
      },
    },
    wordsByCount,
    longestThirty,
    themes: [],
  };
  sentences.forEach((s) => {
    const { affinityAnalyzer } = setupNLPTools();
    const sentenceThemes = getSentenceThemes(s);
    const thisSentenceWordTokens = buildArrOfWords(s);
    const sentScore = affinityAnalyzer.getSentiment(thisSentenceWordTokens);

    // create sentence obj
    let thisObj = {};
    thisObj.sentence = s;
    thisObj.sentimentScore = sentScore;
    thisObj.length = thisSentenceWordTokens.length;
    thisObj.longestWord = getLongestWord(thisSentenceWordTokens);
    thisObj.themes = sentenceThemes;
    internalSummary.themes.push(sentenceThemes);
    sentenceArr.push(thisObj);

    // update summary
    internalSummary.sentences = internalSummary.sentences + 1;
    internalSummary.words = internalSummary.words + thisObj.length;

    if (sentScore > 0) {
      internalSummary.sentiments.positive.count =
        internalSummary.sentiments.positive.count + 1;
    }
    if (sentScore < 0) {
      internalSummary.sentiments.negative.count =
        internalSummary.sentiments.negative.count + 1;
    }
    if (sentScore == 0) {
      internalSummary.sentiments.neutral.count =
        internalSummary.sentiments.neutral.count + 1;
    }

    internalSummary.sentiments.positive.percent = Math.round(
      (internalSummary.sentiments.positive.count / internalSummary.sentences) *
        100,
      0,
    );
    internalSummary.sentiments.negative.percent = Math.round(
      (internalSummary.sentiments.negative.count / internalSummary.sentences) *
        100,
      0,
    );
    internalSummary.sentiments.neutral.percent = Math.round(
      (internalSummary.sentiments.neutral.count / internalSummary.sentences) *
        100,
      0,
    );
  });

  // update summary Theme Data
  internalSummary.themes = internalSummary.themes.reduce(
    (curObj, sentenceArray) => {
      let reduceObjCopy = curObj;
      sentenceArray.forEach((themeWord) => {
        if (!reduceObjCopy[themeWord]) {
          reduceObjCopy[themeWord] = 1;
        } else {
          reduceObjCopy[themeWord] = reduceObjCopy[themeWord] + 1;
        }
      });
      return reduceObjCopy;
    },
    {},
  );

  internalSummary.themes = Object.keys(internalSummary.themes)
    .map((theme) => ({
      theme,
      sentences: internalSummary.themes[theme],
    }))
    .sort((a, b) => b.sentences - a.sentences);
  return { summary: internalSummary, sentenceArr };
}
export default async function postHandler(req, res) {
  let { summary, sentenceArr } = await getTextStats(req.body.text);
  return res.status(200).json({ summary, sentenceAnalysis: sentenceArr });
}
