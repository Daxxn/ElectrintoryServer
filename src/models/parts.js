const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const partSchema = new Schema({
  partName: { type: String, required: true },
  manufacturer: { type: String, default: '' },
  inventory: { type: Number, default: 0 },
  ordered: { type: Number, default: 0 },
  desc: { type: String, default: '' },
  datasheet: { type: String, default: '' },
  tags: [String],
  packages: [{ type: ObjectId, ref: 'packages' }],
});

module.exports = mongoose.model('parts', partSchema);
