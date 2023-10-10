import { ObjectId } from 'mongodb'
async function getById(req, res) {
  try {
    const stateModule = await import('../../../../state.js')
    let foundObj = await stateModule.speeches().findOne({ _id: new ObjectId(req.params.SpeechId) });
    return res.status(200).json(foundObj);
  } catch (error) {
    res.status(500).json({ Good: "Lord" })
    console.log(error.message)
    
  }
}

export { getById };