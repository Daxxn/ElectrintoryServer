class Config {
  static _config = null;

  /**
   * Get the config object.
   * @returns Config object
   */
  static get() {
    if (this._config) {
      return this._config;
    } else {
      return this.build();
    }
  }

  /**
   * PRIVATE. Builds the config object, pulls
   * all the environment variables, and sends a
   * message if some are missing.
   * @param {Function} callback error callback
   * @returns {Config} Setup config object
   */
  static build(callback) {
    try {
      this._config = {
        debug: process.env.DEBUG,
        audience: process.env.AUTH_AUDIENCE,
        issuer: process.env.AUTH_ISSUER,
        jwt: process.env.AUTH_JWT_URI,
        port: process.env.PORT ?? 3131,
        secret: process.env.SECRET,
        dbConnect: process.env.DB_CONNECT,
        client: process.env.CLIENT,
      };
      const variables = [];
      const keys = Object.keys(this._config);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (!this._config[key]) {
          variables.push(key);
        }
      }
      if (variables.length > 0) {
        console.error('Missing ENV Variables!! ', variables);
      }
    } catch (err) {
      if (callback) {
        callback(new Error(`Unknown Config Build Failure : ${err}`));
      } else {
        throw err;
      }
    }
    return this._config;
  }
}

module.exports = Config;
