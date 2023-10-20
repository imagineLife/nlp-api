export default function expectTextInBody(req, res, next) {
  if (!req?.body?.text) {
    throw new Error(
      'expects a json request in the body with a "text" key, like this -> { text: `here`}',
    );
  }
  next();
}
