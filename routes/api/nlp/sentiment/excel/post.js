import {
  buildArrOfWords,
  setupNLPTools,
  getWordsByCount,
  mergeWordsByCount,
  getSentenceThemes,
} from "./../../../../../lib/index.js";
import { mean, median, max, min } from "d3-array";

// function mergeAndAddObjVals(startingArr, newObj) {
// }

const { affinityAnalyzer } = setupNLPTools();

export default function excelPost(req, res) {
  let resArr = [];

  // set result object keys as question-text via first answer row
  const firstRow = req.body.text[0][0];
  Object.keys(firstRow).forEach((question, qIdx) => {
    resArr[qIdx] = {
      question,
      answers: [],
      sentimentScores: [],
      wordsByCount: [],
      themes: [],
    };
  });

  // EACH ANSWER: fill results object question ANSWERS array with stats
  req.body.text[0].forEach((answerRow) => {
    Object.keys(answerRow).forEach((answer, qIdx) => {
      const thisAnswer = answerRow[answer];
      const sentenceThemes = getSentenceThemes(thisAnswer);
      const thisSentenceWordTokens = buildArrOfWords(thisAnswer);
      const sentScore = Number(
        affinityAnalyzer.getSentiment(thisSentenceWordTokens).toFixed(1),
      );
      const answerWordsByCount = getWordsByCount(thisSentenceWordTokens);

      const answerObj = {
        text: answerRow[answer],
        sentimentScore: sentScore || 0,
        themes: sentenceThemes,
      };

      resArr[qIdx].answers.push(answerObj);

      /*
        update question summary data with THIS ANSWER data
      */
      resArr[qIdx].themes = resArr[qIdx].themes.concat(sentenceThemes);
      resArr[qIdx].sentimentScores.push(sentScore);
      const updatedWordsByCount = mergeWordsByCount(
        resArr[qIdx].wordsByCount,
        answerWordsByCount,
      );
      resArr[qIdx].wordsByCount = updatedWordsByCount;
    });
  });

  /*
    summary stats updates
    - sort the wordsByCount in each question
    - get sentiment stats: mean, median, max, min
  */
  resArr.forEach((q) => {
    q.wordsByCount.sort((a, b) => b.occurrences - a.occurrences);

    q.sentimentStats = {
      max: max(q.sentimentScores),
      min: min(q.sentimentScores),
      median: Number(median(q.sentimentScores).toFixed(1)),
      mean: Number(mean(q.sentimentScores).toFixed(1)),
    };

    let sentimentCounts = {
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
    };

    q.sentimentScores.forEach((ss) => {
      if (ss < 0)
        sentimentCounts.negative.count = sentimentCounts.negative.count + 1;
      if (ss > 0)
        sentimentCounts.positive.count = sentimentCounts.positive.count + 1;
      if (ss == 0)
        sentimentCounts.neutral.count = sentimentCounts.neutral.count + 1;
    });

    sentimentCounts.positive.percent = Math.round(
      (sentimentCounts.positive.count / q.sentimentScores.length) * 100,
      0,
    );
    sentimentCounts.negative.percent = Math.round(
      (sentimentCounts.negative.count / q.sentimentScores.length) * 100,
      0,
    );
    sentimentCounts.neutral.percent = Math.round(
      (sentimentCounts.neutral.count / q.sentimentScores.length) * 100,
      0,
    );

    q.sentimentCounts = sentimentCounts;

    delete q.sentimentScores;
    q.themes = q.themes.reduce(
      (uniq, theme) => (uniq.includes(theme) ? uniq : [...uniq, theme]),
      [],
    );
  });

  return res.json(resArr);
}
