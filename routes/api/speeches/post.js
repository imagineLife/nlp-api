async function postASpeech(req, res) {
  // sanity checking
  const {
    body: { author, text, date },
  } = req;
  if (!author || !text || !date) {
    return res.status(422).json({ Error: 'missing required params' });
  }

  try {
    await import('./../../../state.js').then(async (stateMod) => {
      const textLessSpace = text.replace(/(\r\n|\n|\r)/gm, '');

      const { insertedId } = await stateMod.get('Speeches').insertOne({
        author,
        originalText: text,
        text: textLessSpace,
        date: new Date(date),
        analytics: {},
        creationDate: new Date(),
      });
      res.set('Location', `/speeches/${insertedId}`).status(200).end();
      const analyticsMod = await import('./../../../lib/index.js');
      analyticsMod.runAnalytics(insertedId);
      return;
    });
  } catch (error) {
    console.log('postASpeech error');
    console.log(error);
    return res.status(500).json({ Error: error.message });
  }
}

export default postASpeech;
