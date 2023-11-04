import natural from 'natural';
import { ObjectId } from 'mongodb';
import { get } from '../../../../../state.js';
import removePunctuation from '../../../../../lib/textAnalysis/removePunctuation.js';

const analysisLookup = {
  bigrams: natural.NGrams.bigrams,
};

async function runNamedAnalyticsHandler(req, res) {
  //
  // GET
  //
  const query = { _id: new ObjectId(req.params.SpeechId) };
  const opts = {
    projection: { _id: 0, 'analytics.sentences': 1 },
  };
  let {
    analytics: { sentences },
  } = await get('Speeches').findOne(query, opts);
  //
  // bigrams
  //
  sentences.forEach((obj) => {
    const withoutEndPunc = removePunctuation(obj.sentence);
    const analyzed = analysisLookup[req.params.analyticName](withoutEndPunc);
    obj[`${req.params.analyticName}`] = analyzed;
  });

  //
  // update
  //
  const updateDoc = {
    $set: {
      'analytics.sentences': sentences,
    },
  };
  let { matchedCount } = await get('Speeches').updateOne(query, updateDoc);

  //
  // finish
  //
  if (matchedCount === 1) return res.status(200).json({ test: 'here' });
  return res.status(500).json({ Error: 'did not modify a document' });
}

export default runNamedAnalyticsHandler;
