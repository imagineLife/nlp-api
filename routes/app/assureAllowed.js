// locally, expects from localhost + id=local-gats
export default function assureAllowed({ hostname, query, allowedHost, allowedQuery }) {
  console.log({ hostname, query, allowedHost, allowedQuery });
  
  
  if (hostname !== allowedHost || query?.id !== allowedQuery.id)
    throw new Error('not allowed fool!');
  return true;
}
