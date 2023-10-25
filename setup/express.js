import express from 'express';
import cors from 'cors';
import registerRoutes from './../routes/index.js';

export default function setupExpress() {
  const DEFAULT_PORT = 3000;
  const PORT_TO_USE = process.env.SERVER_PORT || DEFAULT_PORT;
  const expressObj = express();

  /*
    Middlewares
  */
  expressObj.use(cors());
  expressObj.use(express.json({ limit: '15mb' }));

  /*
    routes
  */
  registerRoutes(expressObj);

  /*
    START the server
  */
  let app = expressObj.listen(PORT_TO_USE, () => {
    console.log(`API: server up & running on port ${PORT_TO_USE}!`);
  });

  return app;
}
