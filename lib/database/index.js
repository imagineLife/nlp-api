function makeConnectionString({ username, pw, host, port, authDB }) {
  // Error Handling
  if (typeof host === "undefined" || typeof port === "undefined") {
    throw new Error(
      `Cannot create db connection with missing param: host: ${host}, port: ${port}`,
    );
  }
  if (!process.env.MONGO_AUTH && (!username || !pw || !authDB)) {
    throw new Error("Cannot create db connection with missing param");
  }

  // no auth?!
  if (!username && !pw && process?.env?.MONGO_AUTH?.toString() === "false") {
    return `mongodb://${host}:${port}/?connectTimeoutMS=2500&retryWrites=true&w=majority`;
  }

  // un+pw with NO auth db
  if (username && pw) {
    return `mongodb+srv://${username}:${pw}@${host}/?retryWrites=true&w=majority`;
  } else {
    throw new Error("cannot build connection string");
  }
}

export { makeConnectionString };
