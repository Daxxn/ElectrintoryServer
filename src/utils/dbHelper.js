const { Mongoose, Model, Document } = require('mongoose');

/**
 * Converts an array to an object with keys.
 * @param {Model[]} data Model data array
 * @returns {Model[]} Model data object with ids as keys.
 */
function listToDict(data) {
  if (data.length <= 0) {
    return data;
  }
  output = {};
  data.forEach((d) => {
    output[d._id] = d;
  });
  return output;
}

/**
 * Find all the matching ids.
 * @param {Model} model The model to search in.
 * @param {ObjectId[]} ids Object IDs.
 * @returns {Document[]|null} all docs that match.
 */
async function findList(model, ids) {
  if (ids.length > 0) {
    const docs = await model.find({
      _id: {
        $in: ids,
      },
    });
    return docs;
  }
  return [];
}

/**
 * Find all the matching ids.
 * @param {Model} model The model to search in.
 * @param {ObjectId[]} ids Object IDs.
 * @returns {Document[]|null} all docs that match as an object with the ID as the key.
 */
async function findObjects(model, ids) {
  if (ids.length > 0) {
    const docs = await model.find({
      _id: {
        $in: ids,
      },
    });
    return listToDict(docs);
  }
  return [];
}

module.exports = {
  listToDict: listToDict,
  findList: findList,
  findObjects: findObjects,
};
