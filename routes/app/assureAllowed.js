// locally, expects from localhost + id=local-gats
export default function assureAllowed({ hostname, query, allowedHost, allowedQuery }) {
  if (hostname !== allowedHost || query?.id !== allowedQuery.id) {
    console.log({ failed: 'assureAllowed', hostname, query, allowedHost, allowedQuery });
    throw new Error('not allowed fool!');
  }
  return true;
}
