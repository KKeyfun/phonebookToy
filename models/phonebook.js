const mongoose = require('mongoose');

const url = `mongodb+srv://${process.env.username}:${process.env.password}@mongomon.aaimrtn.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

mongoose.set('strictQuery',false);
mongoose.connect(url).then(() => {
    console.log('connected to database');
    }).catch(error => {
        console.log('error connecting to database',error);
    })

const phonebookSchema = new mongoose.Schema({
  name : {
    type: String,
    minLength:3,
    required: [true, 'Username Required'],
  },
  number: {
    type: String,
    minLength:9,
    validate: {
      validator: function(str){
        return /^\d{2,3}-\d{6,}$/.test(str);
      },
      message: props => `${props.value} is not a valid phone number`
    },
    required: [true, 'Phone number required']
  },
})

phonebookSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

module.exports = mongoose.model('Entries', phonebookSchema);
