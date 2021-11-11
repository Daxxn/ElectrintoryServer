const Response = require('express').Response;

const messages = {
  400: {
    '': 'Bad Request.',
    noBody: 'No Body was provided with the request.',
    noUser: 'Unable to find user.',
    noSave: (name) => `Unable to save ${name}`,
    notFound: (name) => `Unable to find ${name}`,
    noSession: 'No current session was found. Log in to continue.',
    noId: (name) => `No ID was provided for ${name}.`,
    noFindById: (name, id) => `Unable to find a ${name} with id ${id}`,
  },
  401: {
    notLoggedIn: 'Unauthorized. Log in first.',
    noUser: 'Unauthorized. No USER is logged in.',
    noSession: 'Unauthorized. No SESSION was found.',
  },
  500: {
    unknown: 'Unknown server error.',
    noSession: 'Unable to find SESSION. Possible internal error. Try again.',
    noUserSession:
      'Unable to find the USER SESSION. Possible internal error. Try again.',
    noUser: 'Unable to find the USER. Possible internal error. Try again.',
    noSave: (name) => `Unable to save ${name} properly. Unknown cause.`,
  },
  501: 'Not implemented yet. Hold on...',
  0: (message) => `Unknown: ${message}`,
};

/**
 * Builds a response message.
 * @param {Response} res Express response object.
 * @param {number} errorCode HTTP error code.
 * @param {string} message Message ID.
 * @param {string|null} name Name of the item.
 * @param {string|null} id ID of the item.
 * @returns {Response} Returns the Express response, just in case.
 */
const messageHelper = (res, errorCode, message, name, id) => {
  res.status(errorCode);
  if (errorCode === 501) {
    res.json({
      message: messages[errorCode],
    });
    return res;
  }
  const msg = messages[errorCode][message];
  if (typeof msg == typeof '') {
    res.json({
      message: msg,
    });
  } else {
    res.json({
      message: msg(name, id),
    });
  }
  return res;
};

module.exports = { messageHelper, messages };
