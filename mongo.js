// Standalone file for command line insert and find queries to mongo db
const mongoose = require('mongoose');
const people = require('./data/phonebook');


const username = process.argv[2];
const password = process.argv[3];

const url =
  `mongodb+srv://${username}:${password}@mongomon.aaimrtn.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const phonebookSchema = new mongoose.Schema({
  name : String,
  number: String,
})

const Entry = mongoose.model('Entries', phonebookSchema)

const queryType = process.argv[4].toLowerCase();

if(queryType === 'insert'){
    if(process.argv[5] && process.argv[6]){
        addToDatabase([{
            name:process.argv[5],
            number:process.argv[6]}]
        );
    } else {
        console.log('give username and password as argument')
        process.exit(1)
    }
} else if(queryType === 'find'){
    searchQuery(process.argv[5],process.argv[6]);
}

function addToDatabase(arr){
    if(!arr){
        return false;
    }
    if(arr.length===1){
        const entry = new Entry({...arr[0]});
        entry.save().then(result => {
            console.log(`Added ${result.name} : ${result.number} to phonebook`);
            mongoose.connection.close();
        }).catch((error) => {
            console.log(error);
        })
        
    }else {
        Entry.insertMany(people).then((result)=>{
            console.log(result);
            mongoose.connection.close();
        }).catch((error) => {
            console.log(error);
        })
    }
}

function searchQuery(field,value){
    if(!field && !value){
        Entry.find({}).then(result => {
            result.forEach(entry => {
                console.log(entry);
            })
            mongoose.connection.close();
        })
    } else if(!value){
        Entry.find({}).select(`${field} -_id`).then(result => {
            result.forEach(entry => {
                console.log(entry);
            })
            mongoose.connection.close();
        })
    }else {
        Entry.find({[`${field}`]:value}).then(result => {
            result.forEach(entry => {
                console.log(entry);
            })
            mongoose.connection.close();
        })
    }
}

// addToDatabase(people)
