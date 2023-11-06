import natural from 'natural';
import { ObjectId } from 'mongodb';
import { get } from '../../../../../state.js';
import removePunctuation from '../../../../../lib/textAnalysis/removePunctuation.js';
import { topNBigrams } from './../../../../../lib/textAnalysis/topBigrams/index.js';
const analysisLookup = {
  bigrams: natural.NGrams.bigrams,
  topTenBigrams: topNBigrams(10),
};

async function runAnalyticSegmented(req, res) {
  //
  // GET
  //
  const query = { _id: new ObjectId(req.params.SpeechId) };
  const opts = {
    projection: { _id: 0, text: 1 },
  };
  const twoWhiteSpaces = /(\s{2})/gm;
  let { text } = await get('Speeches').findOne(query, opts);
  let cleanedText = text.replace(twoWhiteSpaces, ' ').replace(/\n/g, ' ');

  //
  // analyze
  //
  const withoutEndPunc = removePunctuation(cleanedText);
  const analyzed = analysisLookup[req.params.analyticName](withoutEndPunc);

  //
  // update
  //
  const updateDoc = { $set: {} };
  updateDoc.$set[`analytics.${req.params.analyticName}`] = analyzed;
  let { matchedCount } = await get('Speeches').updateOne(query, updateDoc);

  //
  // finish
  //
  if (matchedCount === 1) return res.status(200).json({ [req.params.analyticName]: analyzed });
  return res.status(500).json({ Error: 'did not modify a document' });
}

export default runAnalyticSegmented;
