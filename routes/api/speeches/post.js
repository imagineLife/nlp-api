import { stateObj } from './../../../state.js';

async function postASpeech(req, res) {
  // sanity checking
  const {
    body: { author, text, date },
  } = req;
  if (!author || !text || !date) {
    return res.status(422).json({ Error: 'missing required params' });
  }

  try {
    const { insertedId } = await stateObj.Collections.Speeches.createOne({ author, text, date });
    return res.set('Location', `/speeches/${insertedId}`).status(200).end();
  } catch (error) {
    return res.status(500).json({ Error: error.message });
  }
}


export default postASpeech;