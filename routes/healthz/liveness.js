export default function livenessHandler(req, res) {
  return res.status(200).send('OK');
}
