import express from 'express';
import session from 'express-session';
import cors from 'cors';

export default function registerMiddleware(expressObj) {
  const MemoryStore = new session.MemoryStore();
  // https://www.npmjs.com/package/express-session#options
  const sessionConfig = {
    // https://www.npmjs.com/package/express-session#name
    name: 'nlpapi',
    // REQUIRED https://www.npmjs.com/package/express-session#secret
    secret: process.env.SERVER_SESSION_SECRET || 'test-secret',
    store: MemoryStore,
    // https://www.npmjs.com/package/express-session#resave
    resave: true,
    // https://www.npmjs.com/package/express-session#saveuninitialized
    saveUninitialized: true,
    // https://www.npmjs.com/package/express-session#saveuninitialized
    cookie: {
      domain: 'localhost',
      sameSite: false,
      // secure: true,
      expires: false,
    },
  };

  expressObj.use(
    cors({
      origin: 'http://localhost:8000',
      methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
      credentials: true,
    })
  );
  expressObj.use(express.json({ limit: '15mb' }));
  expressObj.use(session(sessionConfig));
}
