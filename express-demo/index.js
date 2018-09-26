//Module Dependencies
const morgan = require('morgan');
//const helmet = require('helmet');
const Joi = require('joi');
const express = require('express');
const app = express();
//Express json parser Middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
//app.use(helmet());
app.use(morgan('tiny'));

//JOI validate Function
function validateList(list) {
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(list, schema);
}

//Declare the list array
const lists = [
    { id: 1, name: "bread" },
    { id: 2, name: "veggie" },
    { id: 3, name: "juice" }
];

//Home Route
app.get('/', (req, res) => {
    res.send('Hello Welcome to TODO list');
});
//Get all the Lists
app.get('/api/lists', (req, res) => {
    res.send(lists);
});
//Get a list
app.get('/api/list/:_id', (req, res) => {
    const list = lists.find(list => list.id === parseInt(req.params._id));
    if (!list) return res.status(404).send('The Given Id is Not matching');
    res.send(list);
});
//create a list
app.post('/api/list', (req, res) => {
    //Object decontruction 
    const { error } = validateList(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const list = {
        id: lists.length + 1,
        name: req.body.name
    };
    lists.push(list);
    res.send(list);
});
//Update the list
app.put('/api/list/:_id', (req, res) => {
    const list = lists.find(list => list.id === parseInt(req.params._id));
    if (!list) return res.status(404).send('The Given Id is Not matching');
    const { error } = validateList(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    list.name = req.body.name;
    res.send(list);

});
//Delete the list
app.delete('/api/list/:_id', (req, res) => {
    const list = lists.find(list => list.id === parseInt(req.params._id));
    if (!list) return res.status(404).send('The Given Id is Not matching');
    const index = lists.indexOf(list);
    lists.splice(index, 1);
    res.send(list);
});

//Setting up the Enviroment port {default port is 3000}
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`The Server is started at ${port}..`));


