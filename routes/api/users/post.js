
async function postAUser(req, res) {
  try {
    const { email, firstName, lastName } = req.body
    await import('./../../../state.js').then(async (stateMod) => {
      const createResult = await stateMod.get('Users').createOne({
        email,
        firstName,
        lastName,
        creationDate: new Date(),
      });
      res.set('Location', `/users/${createResult.insertedId}`).status(200).end();
      return;
    });
  } catch (error) {
    return res.status(500).json({ Error: error.message });
  }
}

export default postAUser;
