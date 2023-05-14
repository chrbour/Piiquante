const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then (sauces => {
        res.status(200).json(sauces)})
    .catch(error => res.status(400).json({error}));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then( sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({error}))
};

exports.createSauce =(req, res,next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId;
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes:0,
        dislikes:0
    });
    sauce.save()
    .then(() => {
        res.status(201).json({message: 'Objet enregistré !'})
    })
    .catch(error => {res.status(400).json({error})});
};

exports.deleteSauce = (req,res, next) =>{
    Sauce.findOne({_id: req.params.id})
    .then ((sauce) => {
        if (sauce.userId != req.auth.userId){
            res.status(401).json({message: 'non autorisé'})
        }
        else {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`,() => {
                Sauce.deleteOne({_id: req.params.id})
                .then(() => {
                    res.status(200).json({message:'Objet supprimé'})
                })
                .catch(error => res.status(401).json({error}))
            })
        }
    })
    .catch(error => {
        res.status(500).json({error});
    })
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file?{
        ...JSON.parse(req.body.sauce),
        imageUrl:`${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    }:{...req.body};
    delete sauceObject._userId;
    Sauce.findOne({_id: req.params.id})
    .then((sauce) => {
        if(sauce.userId != req.auth.userId){
            res.status(403).json({message:'unauthorized request'});
        }
        else {
            Sauce.updateOne({_id: req.params.id},{...sauceObject, _id:req.params.id})
            .then(() => res.status(200).json({message:'tout est ok'}))
            .catch(error => { res.status(401).json({error})});
        }
    })
    .catch(error => {
        res.status(400).json({error})
    })
};

exports.likeSauce = (req, res,next) => {
    Sauce.findOne({_id: req.params.id})
    .then ((sauce) => {
    
        let like = req.body.like;
        let userId = req.body.userId;
        let voteLike = 0; 
        let voteDislike = 0;
        for ( user of sauce.usersLiked){console.log('user Like',user,' ',userId);
            if (user==userId){
                voteLike++;
            }
        }
        for ( user of sauce.usersDisliked){
            if (user==userId){
                voteDislike++;
            }
        };
        console.log('voteLike',voteLike,'voteDislike',voteDislike);
        switch (like){
            case 1: 
                if(voteLike+voteDislike==0){
                    sauce.likes++;
                    sauce.usersLiked.push(userId);
                    sauce.save();
                };
                break;
            case -1: 
                if(voteLike+voteDislike==0){
                    sauce.dislikes++;
                    sauce.usersDisliked.push(userId);
                    sauce.save();
                };
                break;
            case 0:
                if (voteLike>0){
                    for (let i in sauce.usersLiked){
                        if (sauce.usersLiked[i]==userId){
                            sauce.usersLiked.splice(i,1);
                            sauce.likes--;
                        }
                    }
                    
                    sauce.save();
                }
                else if (voteDislike>0) {
                    for (let i in sauce.usersDisliked){
                        if (sauce.usersDisliked[i]==userId){
                            sauce.usersDisliked.splice(i,1);
                            sauce.dislikes--;
                        }
                    }
                    
                    sauce.save();
                }
                break;
        }
        console.log(sauce);
        res.status(200).json({message: 'Likes mis à jour'})
    })
    .catch (error => ({error}))
    
;}