// Phonebook backend with node only
const http = require('http');
const Controller = require('./nodeRequestMethods/controllerNode');
const getRequest = require('./nodeRequestMethods/getRequestNode');

const app = http.createServer(async (request, response) => {
  // Routes
  if (request.url.match(/\/info\/?/) && request.method === 'GET') {
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.write(`<div>Phonebook has info for ${Controller.countPeople()} people </div>`);
    response.write(`${new Date()}`);
    response.end();
  } else if (request.url.match(/\/api\/phonebook\/([0-9]+)/) && request.method === 'GET') {
    // Individual note retrieval
    try {
      const id = request.url.split('/')[3];
      const entry = await new Controller().getPhonebookEntry(id);
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify(entry));
    } catch (error) {
      response.writeHead(404, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ message: error }));
    }
  } else if (request.url.match(/\/api\/phonebook\/?/) && request.method === 'GET') {
    // Phonebook collection retrieval
    const phonebook = await Controller.getPhonebook();
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(phonebook));
  } else if (request.url.match(/\/api\/phonebook\/?$/) && request.method === 'POST') {
    // Add new phonebook entry
    try {
      const requestData = await getRequest(request).then((res) => Controller.checkValid(res));
      const person = await Controller.addEntry(requestData);

      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify(person));
    } catch (error) {
      response.writeHead(404, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ message: error }));
    }
  } else if (request.url.match(/\/api\/phonebook\/([0-9]+)/) && request.method === 'DELETE') {
    // Delete specified note
    try {
      const id = request.url.split('/')[3];
      const returnMessage = await Controller.deleteEntry(parseInt(id));
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ returnMessage }));
    } catch (error) {
      response.writeHead(404, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ message: error }));
    }
  } else if (request.url.match(/\/api\/phonebook\/([0-9]+)/) && request.method === 'PUT') {
    // Update an entry in the phonebook
    try {
      const id = request.url.split('/')[3];
      const requestData = await getRequest(request);
      const updatedEntry = await Controller.updateEntry(parseInt(id), requestData);
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify(updatedEntry));
    } catch (error) {
      response.writeHead(404, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ message: error }));
    }
  } else {
    response.writeHead(404, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ message: 'Route not found', status: 404 }));
  }
});
app.listen(3001);
