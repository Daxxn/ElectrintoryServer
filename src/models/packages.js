const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const packageSchema = new Schema({
  name: { type: String, required: true },
  packageId: { type: String, required: true },
  leads: { type: Number, default: 0 },
  desc: { type: String, default: '' },
});

module.exports = mongoose.model('packages', packageSchema);
