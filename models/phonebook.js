const mongoose = require('mongoose');

const url = `mongodb+srv://${process.env.username}:${process.env.password}@mongomon.aaimrtn.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

mongoose.set('strictQuery',false);
mongoose.connect(url);

const phonebookSchema = new mongoose.Schema({
  name : String,
  number: String,
})

module.exports = mongoose.model('Entries', phonebookSchema);
