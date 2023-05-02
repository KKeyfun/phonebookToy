let data = require('../data/phonebook');

function generateId() {
  return (Math.floor(Math.random() * 100) + 3);
}

function findEntry(id) {
  return data.find((entry) => entry.id === id);
}

function countPeople() {
  return data.length;
}

function checkValid(requestData, response) {
  if (!requestData.name || !requestData.number) {
    return response.status(400).json({
      error: 'Content missing',
    });
  }
  if (data.find((entry) => entry.name === requestData.name)) {
    return response.status(400).json({
      error: 'Name already exists',
    });
  }
  return null;
}

function getPhonebook(response) {
  response.json(data);
}

function getPhonebookEntry(response, id) {
  const target = findEntry(id);

  if (target) {
    response.json(target);
  } else {
    response.status(404).json({ error: 'Entry not found' }).end();
  }
}

function addEntry(request, response) {
  const personData = request.body;
  const error = checkValid(personData, response);
  if (error) {
    return;
  }
  const person = {
    id: generateId(),
    ...personData,
  };
  data = data.concat(person);
  response.json(person);
}

function deleteEntry(response, id) {
  const target = findEntry(id);
  if (target) {
    data = data.filter((entry) => entry.id !== target.id);
    response.json(data);
  } else {
    response.status(404).json({ error: 'Entry not found' }).end();
  }
}

async function updateEntry(response, { name, number }, id) {
  const target = findEntry(id);

  if (target) {
    data = data.map((entry) => {
      if (entry.id === id) {
        return {
          ...target,
          name,
          number,
        };
      }
      return entry;
    });
    response.json(data);
  } else {
    response.status(404).json({ error: 'Entry not found' }).end();
  }
}

module.exports = {
  getPhonebook, getPhonebookEntry, addEntry, updateEntry, deleteEntry, checkValid, countPeople,
};
