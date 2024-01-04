import express from 'express';
import cors from 'cors';

export default function registerMiddleware(expressObj) {
  const origin =
    process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : 'https://laursen.tech';
  expressObj.use(
    cors({
      credentials: true,
      methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD', 'DELETE'],
      origin,
    })
  );
  expressObj.use(express.json({ limit: '15mb' }));
}
