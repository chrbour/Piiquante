const Sauce = require('../models/Sauce.js');
const fs = require('fs');
console.log('controller');

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then (sauces => {
        console.log('pas de sauce actuellement');
        res.status(200).json(sauces)})
    .catch(error => res.status(400).json({error}));
}