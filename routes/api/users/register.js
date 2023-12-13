/*
  NEED TO UPDATE
  - "defend"
    - against overwriting existing users
    - against setting a pw repeatedly
*/
export default async function registerEmailHandler(req, res) {
  try {
    const { email, password } = req.body;

    await import('./../../../state.js').then(async (stateMod) => {
      const usersObject = stateMod.get('Users');

      /*
        register email
      */
      if (email && !password) {
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
        req.session.userEmail = email;
        res.status(200).end();

        // copy "default" themes into user object for user-editable themes
        // await usersObject.setupThemes({ email })
        return;
      }
    });
  } catch (error) {
    return res.status(500).json({ Error: error.message });
  }
}
