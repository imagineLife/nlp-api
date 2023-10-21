async function postAUser(req, res) {
  try {
    const { email, firstName, lastName, password } = req.body;
    await import('./../../../state.js').then(async (stateMod) => {
      const usersObject = stateMod.get('Users');
      const { salt, saltedPw } = usersObject.saltPw(password);

      const createResult = await usersObject.createOne({
        creationDate: new Date(),
        email,
        firstName,
        lastName,
        salt,
        saltedPw,
      });
      res.set('Location', `/users/${createResult.insertedId}`).status(200).end();
      return;
    });
  } catch (error) {
    return res.status(500).json({ Error: error.message });
  }
}

export default postAUser;
