function serverKiller(expressObj, dbClient) {
  function killEmAll(signal) {
    console.log(`registering signal handling for ${signal}`);

    process.on(signal, async () => {
      console.log(`${signal} received: closing HTTP server`);
      await dbClient.close();
      expressObj.close(() => {
        console.log('express server closed');
      });
    });
  }
  ['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach(killEmAll);
}

export { serverKiller }