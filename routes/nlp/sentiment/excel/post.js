import { buildArrOfWords, setupNLPTools } from './../../../../lib/index.js';

export default function excelPost(req, res) {
  /*
    questions will be items in array, ordered by question from the frontend....
   */
  let resArr = [];

  req.body.text[0].forEach((answerRow, idx) => {
    // set result object keys
    if (idx === 0) {
      Object.keys(answerRow).forEach((question, qIdx) => {
        // set results object keys as question-text via first answer row
        resArr[qIdx] = {
          question,
          answers: [],
        };
      });
    }

    Object.keys(answerRow).forEach((question, qIdx) => {
      // fill results object question ANSWERS array with stats
      const { affinityAnalyzer } = setupNLPTools();
      const thisAnswer = answerRow[question];
      const thisSentenceWordTokens = buildArrOfWords(thisAnswer);
      const sentScore = Number(affinityAnalyzer.getSentiment(thisSentenceWordTokens).toFixed(1));

      resArr[qIdx].answers.push({
        text: answerRow[question],
        sentimentScore: sentScore || 0,
      });
    });
  });

  return res.json(resArr);
}
