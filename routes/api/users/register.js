/*
  NEED TO UPDATE
  - "defend"
    - against overwriting existing users
    - against setting a pw repeatedly
*/
export default async function registerEmailHandler(req, res) {
  try {
    const { email, password, jwt } = req.body;

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
        console.log('registerEmailHandler jwt');
        console.log('jwt');
        console.log(jwt);

        const decoded = jwt.verify(jwt, process.env.SERVER_SESSION_SECRET);
        console.log('decoded');
        console.log(decoded);

        res.status(200).end();
        return;
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ Error: error.message });
  }
}
