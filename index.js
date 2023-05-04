// Phonebook backend with express and mongodb
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const Entry = require('./models/phonebook');

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
  Entry.findById(request.params.id).then(entry => {
    response.json(entry);
  })
});

// Phonebook collection route
app.get('/api/phonebook', (request, response) => {
  Entry.find({}).then(entries => {
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
      'name':body.name,
      'number':body.number
    });
    entry.save().then((newEntry) => {
      response.json(newEntry);
    })
  }
});

// Delete note route
app.delete('/api/phonebook/:id', (request, response, next) => {
  Entry.findByIdAndRemove(request.params.id)
    .then(response => {
      response.status(204).end();
    })
    .catch(error => next(error))
});

// Update note route
app.put('/api/phonebook/:id', (request, response, next) => {
  const updatedEntryObject = {
    number: request.body.number
  }

  Entry.findByIdAndUpdate(request.params.id,updatedEntryObject,{new:true})
    .then(updatedEntry => {
      response.json(updatedEntry)
    })
    .catch(error => next(error));
});


function checkValid(requestData, response) {

  if(requestData.name == undefined|| requestData.undefined) {
    return response.status(400).json({ error: `Invalid Name or Number`});
  }

  return true;
}

function generateId() {
  return (Math.floor(Math.random() * 100) + 3);
}

// handler for unknown route
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}
app.use(unknownEndpoint);
app.use(errorHandler);
app.listen(3001);