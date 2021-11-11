const express = require('express');
const userModel = require('../models/users');
const partModel = require('../models/parts');
const packageModel = require('../models/packages');
const { findObjects } = require('../utils/dbHelper');
const { messageHelper } = require('../utils/messageHelper');

const buildRoute = () => {
  const router = express.Router();
  // #region READ/GET
  router.get('/', async (req, res, next) => {
    res.status(401).json({
      message: 'Need a user ID.',
    });
  });

  router.get('/:id', async (req, res, next) => {
    try {
      const foundUser = await userModel.findOne({ authId: req.params.id });
      if (foundUser) {
        const parts = await findObjects(partModel, foundUser.parts);
        const packages = await findObjects(packageModel, foundUser.packages);
        res.status(200).json({
          user: foundUser,
          parts,
          packages,
        });
      } else {
        res.status(202).json({
          message: 'No User Found.',
        });
      }
    } catch (err) {
      next(err);
    }
  });
  // #endregion

  // #region UPDATE/PATCH
  router.patch('/', async (req, res, next) => {
    try {
      const { body } = req;
      if (body) {
        const foundUser = await userModel.findById(body._id);
        if (foundUser) {
          var data = body;
          if (data._id) {
            delete data._id;
          }
          if (data.__v) {
            delete data.__v;
          }
          Object.assign(foundUser, data);
          const savedUser = await foundUser.save();
          res.status(201).json({
            user: savedUser,
          });
        } else {
          res.status(400).json({
            message: 'No User Found.',
          });
        }
      } else {
        res.status(400).json({
          message: 'No Body',
        });
      }
    } catch (err) {
      next(err);
    }
  });
  // router.patch('/:id', async (req, res, next) => {
  //   try {
  //     const { body } = req;
  //     if (body) {
  //       const foundUser = await userModel.findById(req.params.id);
  //       if (foundUser) {
  //         var data = body;
  //         if (data._id) {
  //           delete data._id;
  //         }
  //         if (data.__v) {
  //           delete data.__v;
  //         }
  //         Object.assign(foundUser, data);
  //         const savedUser = await foundUser.save();
  //         res.status(201).json({
  //           user: savedUser,
  //         });
  //       } else {
  //         res.status(400).json({
  //           message: 'No User Found.',
  //         });
  //       }
  //     } else {
  //       res.status(400).json({
  //         message: 'No Body',
  //       });
  //     }
  //   } catch (err) {
  //     next(err);
  //   }
  // });
  // #endregion

  // #region DELETE
  router.post('/unregister/:id', async (req, res, next) => {
    try {
      if (req.params.id) {
        const foundUser = await userModel.findById(req.params.id);
        if (foundUser) {
          const removedParts = await partModel.deleteMany({
            _id: { $in: foundUser.parts },
          });
          const removedPacks = await packageModel.deleteMany({
            _id: { $in: foundUser.packages },
          });

          res.status(201).json({
            message: 'Deleted User.',
            success: true,
            remParts: removedParts.deletedCount,
            remPackages: removedPacks.deletedCount,
          });
        } else {
          res.status(400).json({
            message: 'No User Found.',
          });
        }
      } else {
        res.status(400).json({
          message: 'No ID.',
        });
      }
    } catch (err) {
      next(err);
    }
  });
  // #endregion

  // #region Auth0
  // router.get('/:id', async (req, res, next) => {
  //   try {
  //     const foundUser = await userModel.find({
  //       authId: req.params.id,
  //     });
  //     if (foundUser) {
  //       const parts = await findObjects(partModel, foundUser.parts);
  //       const packages = await findObjects(packageModel, foundUser.packages);
  //       res.status(200).json({
  //         user: foundUser,
  //         parts,
  //         packages,
  //       });
  //     } else {
  //       res.status(400).json({
  //         message: 'No User Found.',
  //       });
  //     }
  //   } catch (err) {
  //     next(err);
  //   }
  // });

  router.post('/register', async (req, res, next) => {
    try {
      const { body } = req;
      if (body) {
        const foundUser = await userModel.findOne({ authId: body.authId });
        if (!foundUser) {
          if (body._id) {
            delete body._id;
          }
          if (body.__v) {
            delete body.__v;
          }
          const newUser = new userModel({
            username: body.name,
            email: body.email,
            authId: body.sub,
          });
          const savedUser = await newUser.save();
          res.status(201).json({
            user: savedUser,
          });
        } else {
          res.status(400).json({
            message: 'User exists already',
          });
        }
      } else {
        res.status(400).json({
          message: 'No Body',
        });
      }
    } catch (err) {
      next(err);
    }
  });
  // #endregion

  return router;
};;

module.exports = buildRoute;
