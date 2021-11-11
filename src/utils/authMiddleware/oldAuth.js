const auth = async (req, res, next) => {
  console.log('In auth check middleware');
  if (req.session) {
    if (req.session.userId) {
      console.log('User logged in.');
      next();
    } else {
      console.log('user NOT logged in.');
      res.status(401).json({
        message: messages[401]['notLoggedIn'],
      });
    }
  } else {
    console.log('User NOT logged in / SESSION issue.');
    res.status(401).json({
      message: messages[401]['notSession'],
    });
  }
};

module.exports = auth;
