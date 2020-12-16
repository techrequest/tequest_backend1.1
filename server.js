

// Import the main express file as a function
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const UserRoutes = require('./routes/UserRoutes');
const ProviderRoutes = require('./routes/ProviderRoutes');
const TechrequestRoutes = require('./routes/TechrequestRoutes');
const initPassportStrategy = require('./passport-config');

// Invoke Libraries
const server = express();
server.use(cors());
server.use(bodyParser.urlencoded({extended: false}));
server.use(bodyParser.json());

// Configure express to use passport
server.use(passport.initialize());

// confugure passport to use pasport-jwt
initPassportStrategy(passport);

const dbString = "mongodb+srv://admin:sak43usd@cluster0.qks5s.mongodb.net/tequest?retryWrites=true&w=majority";

mongoose
    .connect(dbString, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(
        () => {
            console.log('db is connected')
        }
    )
    .catch(
        (error) => {
            console.log('db is NOT connected. An error occured.', error)
        }
    )


server.get(
    '/', // http://www.apple.com/
    (req, res) => {
        res.send("<h1>Welcome to TeQuest Home</h1>")
    }
);

//User Route
server.use(
    '/users',
    UserRoutes

);

// Products route
server.use(
    '/providers',
    passport.authenticate('jwt', {session: false}),
    ProviderRoutes

);

// Technician Request route
server.use(
    '/requests',    
    TechrequestRoutes

);



server.get(
    '*',
    (req, res) => {
        res.send('<h1>404</h1>')
    }
);


// Connects a port number on the server
server.listen(
    8080, 
    ()=>{
        console.log('server is running on http://localhost:8080');
    }
);
