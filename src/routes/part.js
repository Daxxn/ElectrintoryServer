const express = require('express');
const partModel = require('../models/parts');
const userModel = require('../models/users');
const dbHelper = require('../utils/dbHelper');
const { messageHelper } = require('../utils/messageHelper');

/**
 * Creates the router and mounts the route methods.
 * @returns Part Router
 */
const buildRoute = () => {
  const router = express.Router();
  // #region READ/GET
  /**
   * Get Part
   * Params: ID: string
   */
  router.get('/:id', async (req, res, next) => {
    try {
      const part = await partModel.findById(req.params.id);
      res.status(200).json(part);
    } catch (err) {
      next(err);
    }
  });
  // #endregion

  // #region CREATE/POST
  // router.post('/', async (req, res, next) => {
  //   try {
  //     const { body } = req;
  //     if (body) {
  //       const newPart = new partModel(body);
  //       const savedPart = await newPart.save();
  //       if (savedPart) {
  //         const foundUser = await userModel.findById(req.session.userId);
  //         if (foundUser) {
  //           foundUser.parts.append(savedPart._id);
  //           await foundUser.save();
  //           res.status(201).json({
  //             user: foundUser,
  //             // partsList: foundUser.parts,
  //           });
  //         } else {
  //           res.status(400).json({
  //             message: 'Unable to find user.',
  //           });
  //         }
  //       } else {
  //         res.status(400).json({
  //           message: 'Part save failed.',
  //         });
  //       }
  //     } else {
  //       res.status(400).json({
  //         message: 'No Body.',
  //       });
  //     }
  //   } catch (err) {
  //     next(err);
  //   }
  // });

  router.post('/:userId', async (req, res, next) => {
    try {
      const { userId } = req.params;
      const { partName } = req.body;
      if (partName) {
        const newPart = new partModel({
          partName,
        });
        const user = await userModel.findById(userId);
        if (user) {
          const savedPart = await newPart.save();
          user.parts.push(savedPart._id);
          const savedUser = await user.save();
          if (savedUser) {
            if (savedPart) {
              const parts = await dbHelper.findObjects(partModel, user.parts);
              res.status(201).json({
                user: savedUser,
                parts,
              });
            } else {
              res.status(400).json({
                message: 'New Part failure.',
              });
            }
          } else {
            res.status(400).json({
              message: 'User Save Failure',
            });
          }
        } else {
          res.status(400).json({
            message: 'No User Found.',
          });
        }
      } else {
        res.status(400).json({
          message: 'No Part Name',
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
        const foundPart = await partModel.findById(body._id);
        if (foundPart) {
          var data = body;
          delete data._id;
          delete data.__v;
          Object.assign(foundPart, data);
          const savedPart = await foundPart.save();
          if (savedPart) {
            res.status(201).json({
              part: savedPart,
            });
          } else {
            res.status(400).json({
              message: 'Unable to save part',
            });
          }
        } else {
          res.status(400).json({
            message: 'No Part found',
          });
        }
      } else {
        res.status(400).json({
          message: 'No Body.',
        });
      }
    } catch (err) {
      next(err);
    }
  });
  // #endregion

  // #region DELETE V1
  // router.delete('/', async (req, res, next) => {
  //    try {
  //       const { body } = req;
  //       if (body) {
  //          if (req.session) {
  //             if (req.session.userId) {
  //                const foundUser = await userModel.findById(req.session.userId);
  //                if (foundUser) {
  //                   const index = foundUser.parts.findIndex(body._id);
  //                   if (index > 0) {
  //                      await partsModel.remove({
  //                         _id: body._id,
  //                      });
  //                      foundUser.parts = foundUser.parts.splice(index, 1);
  //                      const savedUser = await foundUser.save();
  //                      res.status(200).json({
  //                         user: savedUser,
  //                         partId: body._id,
  //                      });
  //                   } else {
  //                      res.status(400).json({
  //                         message: 'Unable to find part.',
  //                      });
  //                   }
  //                } else {
  //                   res.status(400).json({
  //                      message: 'No User found.',
  //                   });
  //                }
  //             } else {
  //                res.status(400).json({
  //                   message: 'No Session User ID',
  //                });
  //             }
  //          } else {
  //             res.status(400).json({
  //                message: 'No Session',
  //             });
  //          }
  //       } else {
  //          res.status(400).json({
  //             message: 'No Body.',
  //          });
  //       }
  //    } catch (err) {
  //       next(err);
  //    }
  // });
  // router.delete('/:id', async (req, res, next) => {
  //    try {
  //       const { id } = req.params;
  //       if (id) {
  //          if (req.session) {
  //             if (req.session.userId) {
  //                const foundUser = await userModel.findById(req.session.userId);
  //                if (foundUser) {
  //                   const index = foundUser.parts.findIndex(id);
  //                   if (index > 0) {
  //                      await partsModel.remove({
  //                         _id: id,
  //                      });
  //                      foundUser.parts = foundUser.parts.splice(index, 1);
  //                      const savedUser = await foundUser.save();
  //                      res.status(200).json({
  //                         user: savedUser,
  //                         partId: id,
  //                      });
  //                   } else {
  //                      res.status(400).json({
  //                         message: 'Unable to find part.',
  //                      });
  //                   }
  //                } else {
  //                   res.status(400).json({
  //                      message: 'No User found.',
  //                   });
  //                }
  //             } else {
  //                res.status(400).json({
  //                   message: 'No Session User ID',
  //                });
  //             }
  //          } else {
  //             res.status(400).json({
  //                message: 'No Session',
  //             });
  //          }
  //       } else {
  //          res.status(400).json({
  //             message: 'No ID.',
  //          });
  //       }
  //    } catch (err) {
  //       next(err);
  //    }
  // });
  // #endregion

  // #region DELETE
  router.delete('/:userId', async (req, res, next) => {
    try {
      const { userId } = req.params;
      const { partId } = req.body;
      if (userId && partId) {
        const foundUser = await userModel.findById(userId);
        if (foundUser) {
          const { parts } = foundUser;
          if (parts.includes(partId)) {
            const removedParts = parts.filter((p) => p != partId);
            foundUser.parts = removedParts;
            const result = await partModel.deleteOne({ _id: partId });
            if (result.deletedCount === 1) {
              const savedUser = await foundUser.save();
              res.status(201).json({
                id: partId,
                user: savedUser,
              });
            } else if (result.deletedCount > 1) {
              res.status(400).json({
                message: 'More that one part was found with that ID.',
              });
            } else {
              res.status(400).json({
                message: 'Unable to find correct part.',
              });
            }
          } else {
            res.status(401).json({
              message: 'Part doesnt belong to you.',
            });
          }
        } else {
          res.status(400).json({
            message: 'Unable to find user.',
          });
        }
      } else {
        messageHelper(res, 400, 'noId');
      }
    } catch (err) {
      next(err);
    }
  });
  // #endregion

  return router;
};

module.exports = buildRoute;
