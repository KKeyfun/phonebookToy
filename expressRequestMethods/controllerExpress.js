let data = require('../data/phonebook');

function findEntry(id) {
  return data.find((entry) => entry.id === id);
}

function countPeople() {
  return data.length;
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
  getPhonebook, getPhonebookEntry, updateEntry, deleteEntry, countPeople,
};
