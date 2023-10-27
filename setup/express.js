import express from 'express';
import registerRoutes from './../routes/index.js';
import registerMiddleware from './../middleware/index.js';
export default function setupExpress() {
  const DEFAULT_PORT = 3000;
  const PORT_TO_USE = process.env.SERVER_PORT || DEFAULT_PORT;
  const expressObj = express();

  registerMiddleware(expressObj);
  registerRoutes(expressObj);

  /*
    START the server
  */
  let app = expressObj.listen(PORT_TO_USE, () => {
    console.log(`API: server up & running on port ${PORT_TO_USE}!`);
  });

  return app;
}
