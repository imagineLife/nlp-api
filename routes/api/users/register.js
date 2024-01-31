import jwt from 'jsonwebtoken';
import { logger } from '../../../lib/logger.js';
/*
  NEED TO UPDATE
  - "defend"
    - against overwriting existing users
    - against setting a pw repeatedly
*/
export default async function registerEmailHandler(req, res) {
  try {
    const { email, password } = req.body;
    const clientJwt = req?.headers?.authorization.split(' ')[1];

    await import('./../../../state.js').then(async (stateMod) => {
      const usersObject = stateMod.get('Users');

      /*
        register email
      */
      if (email && !password) {
        let canRegisterRes = await usersObject.canRegister({ email });
        if (!canRegisterRes) return res.status(422).json({ Error: 'cannot register' });

        await usersObject.registerEmail({
          email,
        });
        res.status(200).end();
        return;
      }

      /*
        complete registration
      */
      if (email && password) {
        const startedRegistration = await usersObject.validateEmail({ email });
        if (!startedRegistration) {
          throw new Error('Cannot complete registration');
        }
        const { modifiedCount } = await usersObject.setPW({ email, password });
        if (modifiedCount !== 1) {
          throw new Error('Cannot complete registration');
        }

        await usersObject.setThemes({ email: req.body.email });
        // TODO: update & send jwt
        const decoded = jwt.verify(clientJwt, process.env.SERVER_SESSION_SECRET);
        decoded.email = req.body.email;
        const newJwt = jwt.sign(decoded, process.env.SERVER_SESSION_SECRET);
        logger.info('new JWT:');
        logger.info(newJwt);
        res.status(200).json({ jwt: newJwt });
        return;
      }
    });
  } catch (error) {
    logger.error(error);
    logger.error(error?.cause);
    return res.status(500).json({ Error: error.message });
  }
}
