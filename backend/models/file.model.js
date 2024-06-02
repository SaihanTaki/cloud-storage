const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  permissions: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }],
    required: true,
  },
  storageLocation: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('FileMetaData', FileSchema);
