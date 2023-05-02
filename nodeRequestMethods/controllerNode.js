let data = require('../data/phonebook');

function countPeople() {
  return data.length;
}

async function checkValid(requestData) {
  return new Promise((resolve, reject) => {
    const { name, number } = JSON.parse(requestData);
    if (!name || !number) {
      reject(new Error('Empty name or number field'));
    } else if (data.find((entry) => entry.name === name)) {
      reject(new Error('Name already exists'));
    }
    resolve(requestData);
  });
}

async function getPhonebook() {
  return new Promise((resolve) => resolve(data));
}

async function getPhonebookEntry(id) {
  return new Promise((resolve, reject) => {
    const target = data.find((entry) => entry.id === parseInt(id));

    if (!target) {
      // Reject if id doesn't exist in phonebook
      reject(new Error(`Entry with ${id} not found`));
    } else {
      // return entry if found
      resolve(target);
    }
  });
}

async function addEntry(newEntry) {
  return new Promise((resolve) => {
    const entryObj = JSON.parse(newEntry);

    const entry = {
      id: (Math.floor(Math.random() * 100) + 3),
      ...entryObj,
    };
    data = data.concat(entry);
    // Return new entry
    resolve(entry);
  });
}

async function deleteEntry(id) {
  return new Promise((resolve, reject) => {
    // console.log(typeof (data[0].id), typeof (id));
    const target = data.find((entry) => entry.id === id);
    data = data.filter((entry) => entry !== target);
    // if no todo, return an error
    if (!target) {
      reject(new Error(`Entry with ${id} not found`));
    }
    // else, return a success message
    resolve('Entry deleted successfully');
  });
}

async function updateEntry(id, requestData) {
  return new Promise((resolve, reject) => {
    const { name, number } = JSON.parse(requestData);
    const target = data.map((entry) => {
      if (entry.id === id) {
        return {
          ...entry,
          name,
          number,
        };
      }
      return entry;
    });
    data = target;
    if (!target) {
      reject(new Error(`Entry with ${id} not found`));
    } else {
      resolve(`Entry with ID:${id} has been updated`);
    }
  });
}

module.exports = {
  getPhonebook, getPhonebookEntry, addEntry, updateEntry, deleteEntry, checkValid, countPeople,
};
