import { speeches } from './../../../state.js';
import { runAnalytics } from './../../../lib/index.js'
async function postASpeech(req, res) {
  // sanity checking
  const {
    body: { author, text, date },
  } = req;
  if (!author || !text || !date) {
    return res.status(422).json({ Error: 'missing required params' });
  }

  try {
    const { insertedId } = await speeches().insertOne({ author, text, date: new Date(date), analytics: {}, creationDate: new Date() });
    res.set('Location', `/speeches/${insertedId}`).status(200).end();
    runAnalytics(insertedId);
    return;
  } catch (error) {
    console.log('postASpeech error');
    console.log(error)
    
    return res.status(500).json({ Error: error.message });
  }
}

export default postASpeech;
