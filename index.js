// Phonebook backend with express and mongodb
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const Entry = require('./models/phonebook')

const app = express();

app.use(cors());
morgan('tiny');
morgan.token('body', (request, response) => (JSON.stringify(request.body)));
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use(express.static('dist'));
// Routes

// Individual note route
app.get('/api/phonebook/:id', (request, response) => {
  const id = +request.params.id;
  // Entry.find({[`${id}`]:id}).select('-_id').then(entries => {
  //   response.json(entries);
  // })
  Entry.findById(id).select('-_id -__v').then(entry => {
    response.json(entry);
  })
});

// Phonebook collection route
app.get('/api/phonebook', (request, response) => {
  Entry.find({}).select('-_id -__v').then(entries => {
    response.json(entries);
  })
});

// Info route
app.get('/info', (request, response) => {
  const infoString = `Phonebook has info for ${phonebook.countPeople()} people </br> ${new Date()}`;
  response.send(infoString);
});

// Add new note route
app.post('/api/phonebook', (request, response) => {
  const body = request.body;
  if(checkValid(body,response)){
    const entry = new Entry({
      'id':generateId(),
      'name':body.name,
      'number':body.number
    });
    entry.save().then((newEntry) => {
      response.json(newEntry);
    })
  }
});

// Delete note route
// TODO
app.delete('/api/phonebook/:id', (request, response) => {
  const id = +request.params.id;
  phonebook.deleteEntry(response, id);
});

// Update note route
// TODO
app.put('/api/phonebook/:id', (request, response) => {
  const id = +request.params.id;
  phonebook.updateEntry(response, request.body, id);
});

app.listen(3001);

function checkValid(requestData, response) {

  if(requestData.name == undefined|| requestData.undefined) {
    return response.status(400).json({ error: `Invalid Name or Number`});
  }

  return true;
}

function generateId() {
  return (Math.floor(Math.random() * 100) + 3);
}