const mongoose = require('mongoose');
const FormDataModel = require('../../src/models/formData'); // Adjust the path to your model

const mongoURI = 'mongodb+srv://muneesm458:wIgwVZZFiUoTIm5p@cluster0.14o1nzf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const formData = JSON.parse(event.body);

  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const newFormData = new FormDataModel(formData);
    await newFormData.save();

    return { statusCode: 200, body: JSON.stringify({ success: true, message: 'Form data saved successfully!' }) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ success: false, message: 'Failed to save form data!' }) };
  }
};
