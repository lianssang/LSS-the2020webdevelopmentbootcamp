const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/fruitDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

/* Schema without validation

const fruitSchema = new mongoose.Schema({
    name: String,
    rating: Number,
    review: String
});
*/

// Schema with validation

const fruitSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please check your data entry, no name specified.']
    },
    rating: {
        type: Number,
        min: 1,
        max: 10
    },
    review: String
});


const Fruit = mongoose.model('Fruit', fruitSchema);

/* Adding a single data

const fruit = new Fruit({
    name: "Apple",
    rating: 7,
    review: "Pretty!"
});

// Saving the data
fruit.save();
*/

/* Inserting a single data into a new collection

// Making a new schema for a new collection
const personSchema = mongoose.Schema({
    name: String,
    age: Number
});

// Creating a new collection
const Person = mongoose.model('Person', personSchema);

// Entrying data into a new collection
const person = new Person({
    name: 'John',
    age: 37
});

// Saving the data
person.save();
*/

/* Inserting multiple data

// Entrying data
const kiwi = new Fruit({
    name: 'Kiwi',
    rating: 10,
    review: 'Looks good!'
});

// Entrying data
const orange = new Fruit({
    name: 'Orange',
    rating: 8,
    review: 'Color is looking fine!'
});

// Entrying data
const banana = new Fruit({
    name: 'Banana',
    rating: 4,
    review: "I don't really like that taste!"
});

// Saving multiple data
Fruit.insertMany([kiwi, orange, banana], function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log('Successfully saved all the fruits to fruitsDB.')
    }
});
*/

/* Finding data from collection

Fruit.find(function (err, fruits) {
    if (err) {
        console.log(err);
    } else {
        // Using forEach loop to log names of fruits
        // fruits.forEach(function (fruit) {
        //     console.log(fruit.name);
        // });

        mongoose.connection.close();
        // Using regular for loop to log names of fruits
        for (var i = 0; i < fruits.length; i++) {
            console.log(fruits[i].name);
        }
    }
});
*/

/* Updating data from collection

Fruit.updateOne({
    _id: '5e3522f375055a0384f988c0'
}, {
    name: 'Peach',
    rating: 9,
    review: 'It is very healthy.'
}, function (err) {
    if (err) {
        console.log(err);
    } else {

        mongoose.connection.close();
        console.log('Sucessfully updated!');
    }
});
*/

/* Deleting data from collection

Fruit.deleteOne({
    _id: '5e3522f375055a0384f988bf'
}, function (err) {
    if (err) {
        console.log(err);
    } else {

        mongoose.connection.close();
        console.log('Successfully deleted!');
    }
});
*/

// /* Deleting multiple data from collection

Fruit.deleteMany({
    color: 'Orange'
}, function (err) {
    if (err) {
        console.log(err);
    } else {

        mongoose.connection.close();
        console.log('Successfully deleted data specified to color that is orange!');
    }
});

/* The code above replaces the code below by using mongoose.connect() */

/* Making connection, adding database name, create client

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'fruitsDB';

// Create a new MongoClient
const client = new MongoClient(url, {
    useUnifiedTopology: true
});

// Use connect method to connect to the server
MongoClient.connect(url, {
    useUnifiedTopology: true
}, function (err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const db = client.db(dbName);

    findDocuments(db, function () {
        client.close();
    });
});

*/

/* Inserting data 

const insertDocuments = function (db, callback) {
    // Get the documents collection
    const collection = db.collection('fruits');
    // Insert some documents
    collection.insertMany([{
            name: "Orange",
            color: "Red",
            score: 5
        },
        {
            name: "Orange",
            color: "Orange",
            score: 4
        },
    ], function (err, result) {
        assert.equal(err, null);
        assert.equal(3, result.result.n);
        assert.equal(3, result.ops.length);
        console.log("Inserted 3 documents into the collection");
        callback(result);
    });
};

// Finding data from collection

const findDocuments = function (db, callback) {
    // Get the documents collection
    const collection = db.collection('fruits');
    // Find some documents
    collection.find({}).toArray(function (err, fruits) {
        assert.equal(err, null);
        console.log("Found the following records");
        console.log(fruits)
        callback(fruits);
    });
}
*/