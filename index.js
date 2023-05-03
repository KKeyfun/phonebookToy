// Phonebook backend with express
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const phonebook = require('./expressRequestMethods/controllerExpress');
const mongoose = require('mongoose');

const url = `mongodb+srv://${username}:${password}@mongomon.aaimrtn.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

mongoose.set('strictQuery',false);
mongoose.connect(url);

const phonebookSchema = new mongoose.Schema({
  name : String,
  number: String,
})

const Entry = mongoose.model('Entries', phonebookSchema);

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
  phonebook.getPhonebookEntry(response, id);
});

// Phonebook collection route
app.get('/api/phonebook', (request, response) => {
  Entry.find({}).select().then(entries => {
    phonebook.getPhonebook(response);
  })
});

// Info route
app.get('/info', (request, response) => {
  const infoString = `Phonebook has info for ${phonebook.countPeople()} people </br> ${new Date()}`;
  response.send(infoString);
});

// New note route
app.post('/api/phonebook', (request, response) => {
  phonebook.addEntry(request, response);
});

// Delete note route
app.delete('/api/phonebook/:id', (request, response) => {
  const id = +request.params.id;
  phonebook.deleteEntry(response, id);
});

// Update note route
app.put('/api/phonebook/:id', (request, response) => {
  const id = +request.params.id;
  phonebook.updateEntry(response, request.body, id);
});

app.listen(3001);
