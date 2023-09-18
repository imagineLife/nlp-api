import { speeches } from '../../../../state.js';
import { ObjectId } from 'mongodb'
async function getById(req, res) {
  // sanity checking
  if (!req?.params?.SpeechId) res.status(422).json({ Error: 'malformed request' });
  
  try {
    const foundObj = await speeches().findOne({_id: new ObjectId(req.params.SpeechId)});
    
    return res.status(200).json(foundObj);
  } catch (error) {
    res.status(500).json({ Good: "Lord" })
    console.log(error.message)
    
  }
}

export { getById };