import { stateObj } from './../../state.js';

export const MISSING_DATA_ERR = 'missing required data to allow access';
export const NO_APP_REGISTERED_ERR =
  'No App Registration stored for this instance, try starting over!';
export const APP_REG_EXP_ERR = 'App Registration Expired, try starting over!';
export default function allowAccessHandler(req, res) {
  /*
    Error Handling
    - require req.query.id
    - req.query.id 
      - SHOULD be in "state"
      - date SHOULD NOT be before now
  */
  if (!req?.query?.id) {
    return res.status(422).json({ Error: MISSING_DATA_ERR });
  }
  const { id: appId } = req.query;

  if (!stateObj[`${appId}`]) {
    return res.status(422).json({ Error: NO_APP_REGISTERED_ERR });
  }

  const savedAppDate = stateObj[`${appId}`];
  if (savedAppDate <= new Date()) {
    delete stateObj[`${appId}`];
    return res.status(422).json({ Error: APP_REG_EXP_ERR });
  }

  delete stateObj[`${appId}`];
  req.session.appId = appId;
  return res.status(200).send({ appId });
}
