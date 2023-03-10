import express from 'express';
const appRouter = express.Router();
// import getHandler from './get.js';

function assureAllowed({ hostname, baseUrl, query, allowedHost, allowedBaseUrl, allowedQuery }) {
  if (hostname !== allowedHost || baseUrl !== allowedBaseUrl || (query?.id !== allowedQuery.id))
    throw new Error('not allowed fool!');
  return true;
}
function getHandler(req, res) {
  console.log('---REQUESTER---')
  const { hostname, baseUrl, query } = req;
  console.log('req.headers')
  console.log(req.headers)
  
  
  var ip = req?.socket?.remoteAddress || req.headers['x-forwarded-for']; 
  console.log('ip')
  console.log(ip)
  
  
  assureAllowed({
    hostname,
    baseUrl,
    query,
    allowedHost: 'localhost',
    allowedBaseUrl: '/app',
    allowedQuery: {id: 'jake-gatsby-site'},
  });
  
  
  
  return res.status(200).json({
    hostname,
    baseUrl,
    query
  });
}
const nlpExpressRouter = express.Router();

// const nlpRoutes = [
//   {
//     path: '/',
//     handler: getHandler,
//   },
// ];

// nlpRoutes.forEach(({ path, handler }) => nlpExpressRouter.use(path, handler));
appRouter.get('/', getHandler)
export default appRouter;
