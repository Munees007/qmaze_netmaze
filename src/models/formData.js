// src/models/formData.js

const mongoose = require('mongoose');

const formDataSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNumber: { type: String, required: true },
  className: { type: String, required: true },
  email: { type: String, required: true },
});

const FormDataModel = mongoose.models.FormData || mongoose.model('FormData', formDataSchema);

module.exports = FormDataModel;
