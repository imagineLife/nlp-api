function serverKiller(expressObj, dbClient) {
  console.log('serverKiller!')
  function killEmAll(signal) {
    console.log(`registering signal handling for ${signal}`);

    process.on(signal, async () => {
      console.log(`${signal} received: closing HTTP server`);
      if (dbClient) await dbClient.close();
      expressObj.close(() => {
        console.log('express server closed');
      });
    });
  }
  ['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach(killEmAll);
}

export { serverKiller }