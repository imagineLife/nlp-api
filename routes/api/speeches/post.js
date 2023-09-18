import { speeches } from './../../../state.js';

const analyticsToRun = ['wordCount'];
function runAnalytics(speechId) {
  let runThese = [...analyticsToRun];
  console.log('run analytics on...')
  
}

async function postASpeech(req, res) {
  // sanity checking
  const {
    body: { author, text, date },
  } = req;
  if (!author || !text || !date) {
    return res.status(422).json({ Error: 'missing required params' });
  }

  try {
    const { insertedId } = await speeches().insertOne({ author, text, date, analytics: {} });
    res.set('Location', `/speeches/${insertedId}`).status(200).end();
    runAnalytics(insertedId);
  } catch (error) {
    return res.status(500).json({ Error: error.message });
  }
}

export default postASpeech;
