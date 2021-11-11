const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  authId: { type: String, required: true },
  parts: [{ type: ObjectId, ref: 'parts' }],
  packages: [{ type: ObjectId, ref: 'packages' }],
  settings: {
    openingView: { type: Number, default: 0 },
  },
});

module.exports = mongoose.model('users', userSchema);
