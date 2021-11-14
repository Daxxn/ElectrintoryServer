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
   * Run once at start. Builds the config object and pulls
   * all the environment variables.
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
      };
      if (process.env.NODE_ENV === 'production') {
        Object.assign(this._config, {
          dbConnect: process.env.PROD_DB_CONNECT,
          client: process.env.PROD_CLIENT,
        });
      } else {
        Object.assign(this._config, {
          dbConnect: process.env.DEV_DB_CONNECT,
          client: process.env.DEV_CLIENT,
        });
      }
    } catch (err) {
      if (callback) {
        callback(new Error(`Config build failure : ${err}`));
      } else {
        throw err;
      }
    }
    return this._config;
  }
}

module.exports = Config;
