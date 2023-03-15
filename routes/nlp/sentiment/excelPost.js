export default function excelPost(req, res) {
  /*
    questions will be items in array, ordered by question from the frontend....
   */
  let resArr = [];

  req.body.text[0].forEach((answerRow, idx) => { 
    // set result object keys
    if (idx === 0) {
      Object.keys(answerRow).forEach((question, qIdx) => {
        resArr[qIdx] = {
          question,
          answers: [
            {
              text: answerRow[question],
            },
          ],
        };
      })
    } else {
      Object.keys(answerRow).forEach((question, qIdx) => {
        resArr[qIdx].answers.push({
          text: answerRow[question],
        });
      });
    }
  })
  

  return res.json(resArr);
}
