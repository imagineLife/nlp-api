import { stateObj } from "./../../../state.js";
function failOnUnwatendFields(req, res, next) {
  const bodyKeys = Object.keys(req.body);
  for (let keyIdx = 0; keyIdx < bodyKeys.length; keyIdx++) {
    if (!stateObj.fields.speechFields.has(bodyKeys[keyIdx]))
      return res.status(422).json({
        Error: "Unexpected speech key",
      });
  }
  next();
}

export { failOnUnwatendFields };
