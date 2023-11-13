import { ObjectId } from 'mongodb';
async function getById(req, res) {
  console.log('----getbyId');
  console.log('req.params.SpeechId');
  console.log(req.params.SpeechId);

  try {
    const stateModule = await import('../../../../state.js');
    let foundCursor = stateModule
      .get('Speeches')
      .find({ _id: new ObjectId(req.params.SpeechId) })
      .project({
        date: 1,
        text: 1,
        author: 1,
        words: '$analytics.wordCount',
        sentences: '$analytics.sentenceCount',
        sentiment: '$analytics.sentiments',
      });
    res.status(200);
    for await (const doc of foundCursor) {
      res.send(doc);
    }
    res.end();
  } catch (error) {
    res.status(500).json({ Good: 'Lord' });
    console.log(error.message);
  }
}

export { getById };
