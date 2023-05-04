const mongoose = require('mongoose');

const url = `mongodb+srv://${process.env.username}:${process.env.password}@mongomon.aaimrtn.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

mongoose.set('strictQuery',false);
mongoose.connect(url).then(() => {
    console.log('connected to database');
    }).catch(error => {
        console.log('error connecting to database',error);
    })

const phonebookSchema = new mongoose.Schema({
  name : String,
  number: String,
})

phonebookSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

module.exports = mongoose.model('Entries', phonebookSchema);
