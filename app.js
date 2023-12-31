const mongoose = require('mongoose');
const express = require ('express');
const path = require('path');

const userRoutes = require('./routes/User');
const sauceRoutes = require('./routes/Sauce');

const app = express();

mongoose.connect('mongodb+srv://chrbour:5RSYTc6HKhQKQmMq@cluster0.7etgpmk.mongodb.net/piiquante?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });
  
app.use(express.json());
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use((req,res) => {
    res.json({message: `Votre message a bien été reçu !`});
});

module.exports = app;