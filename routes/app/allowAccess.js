import { stateObj } from './../../state.js';

export default function allowAccessHandler(req, res) {
  /*
    Error Handling
    - require req.query.id
    - req.query.id 
      - SHOULD be in "state"
      - date SHOULD NOT be before now
  */
  if (!req?.query?.id) {
    return res.status(422).json({ Error: "missing required data to allow access" });
  }
  const { id: appId } = req.query;

  if (!stateObj[`${appId}`]) {
    return res
      .status(422)
      .json({ Error: 'No App Registration stored for this instance, try starting over!' });
  }

  const savedAppDate = stateObj[`${appId}`];
  if (savedAppDate <= new Date()) {
    delete stateObj[`${appId}`];
    return res.status(422).json({ Error: 'App Registration Expired, try starting over!' });
  }

  delete stateObj[`${appId}`];
  return res.status(200).send({ appId });
}
