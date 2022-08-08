const mongoose = require("mongoose");
const Schema = mongoose.Schema;

if (process.argv.length < 3) {
  console.log(
    "Please provide your password, your name and phone as an argument: node mongo.js <password> <name> <phone>"
  );
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const phone = process.argv[4];


const mongoURI = `mongodb+srv://filomena-55:${password}@cluster0.8rfdtdi.mongodb.net/guia-phone?retryWrites=true&w=majority`;

mongoose.connect(mongoURI, { useNewUrlParser: true });

const personSchema = new Schema({
  name: String,
  number: String,
  id: Number,
});

const Person = mongoose.model("Person", personSchema);
if (name!== undefined || phone !== undefined) {
  const person = new Person({
    name: name,
    number: phone,
    id: 1,
  });

    person.save().then((response) => {
      console.log("person saved!");
      console.log(`Adding ${name} with phone ${phone}`);
      mongoose.connection.close();
    }
    ).catch((error) => {
        console.log("error", error);
        mongoose.connection.close();
        }
    );
}else{
    Person.find({}).then((result) => {
        result.forEach((person) => {
            console.log(`Phonebook: ${person.name} ${person.number}`);
        }
        );
        mongoose.connection.close();
    }
    ).catch((error) => {
        console.log("error", error);
        mongoose.connection.close();
        }
    );
}
