import express from 'express';
import session from 'express-session';
import cors from 'cors';

export default function registerMiddleware(expressObj) {
  // https://www.npmjs.com/package/express-session#options
  const sessionConfig = {
    // https://www.npmjs.com/package/express-session#name
    name: 'nlpapi',
    // REQUIRED https://www.npmjs.com/package/express-session#secret
    secret: process.env.SERVER_SESSION_SECRET || 'test-secret',
    // https://www.npmjs.com/package/express-session#resave
    resave: false,
    // https://www.npmjs.com/package/express-session#saveuninitialized
    saveUninitialized: true,
    // https://www.npmjs.com/package/express-session#saveuninitialized
    cookie: { secure: false },
  };

  expressObj.use(cors());
  expressObj.use(express.json({ limit: '15mb' }));
  expressObj.use(session(sessionConfig));
}
