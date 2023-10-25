function serverKiller(expressObj, dbClient) {
  function killEmAll(signal) {
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

export { serverKiller };
