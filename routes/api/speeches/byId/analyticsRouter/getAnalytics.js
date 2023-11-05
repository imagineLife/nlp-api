import { ObjectId } from 'mongodb';

async function getAnalytics(req, res) {
  try {
    const stateModule = await import('../../../../../state.js');
    let foundObj = await stateModule.get('Speeches').findOne(
      { _id: new ObjectId(req.params.SpeechId) },
      {
        projection: { _id: 0, analytics: 1 },
      }
    );
    res.status(200).json(foundObj?.analytics);
    return;
  } catch (error) {
    if (
      error?.message?.includes(
        'Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer'
      ) ||
      error?.message?.includes(
        'input must be a 24 character hex string, 12 byte Uint8Array, or an integer'
      )
    ) {
      return res.status(500).json({ Error: 'bad id' });
    } else {
      throw new Error(error);
    }
  }
}

export { getAnalytics };
