var express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;


const contacts = function(req, res, next) {
  var contacts = req.db.collection("contacts");
  contacts.find().toArray(function(err, info) {
    if(!err)
    {
      res.render('contacts', {contactList: info});
    }
    else
    {
      next(err);
    }
  });
}

/* GET home page. */
router.get('/', contacts);
router.get('/contacts', contacts);

router.get('/mailer', function(req, res, next) {
  
  res.render('mailer', { });
});

router.post('/thanks', function(req, res, next){
      var contacts = req.db.collection("contacts");
      var contactByMail = false;
      var contactByPhone = false;
      var contactByEmail = false;

      if(req.body.MailContact == "MailContact")
        contactByMail = true;
      if(req.body.PhoneContact == "PhoneContact")
        contactByPhone = true;
      if(req.body.EmailContact == "EmailContact")
        contactByEmail = true;
      
      contacts.insertOne({prefix: req.body.Prefix, first: req.body.FirstName, last: req.body.LastName, street: req.body.Street, city: req.body.City, state: req.body.State, zip: req.body.Zip, phone: req.body.Phone, email: req.body.Email, mailContact: contactByMail, phoneContact: contactByPhone, emailContact: contactByEmail});

      var message = "Thank you for signing up!"

  res.render('thanks', {message: message});
});

router.get('/update', function(req, res, next) {
      var contacts = req.db.collection("contacts");

      contacts.findOne({_id : ObjectID(req.query.ConId)}, function(err, updateContact) {
        if(!err)
        {
          if(updateContact == null)
          {
            res.redirect('/contacts');
            return;
          }

          res.render('update', {contact: updateContact});
        }
        else
        {
          next(err);
        }
      })
});

router.post('/updater', function(req, res, next) {
      var contacts = req.db.collection("contacts");
      var contactByMail = false;
      var contactByPhone = false;
      var contactByEmail = false;

      if(req.body.MailContact == "MailContact")
        contactByMail = true;
      if(req.body.PhoneContact == "PhoneContact")
        contactByPhone = true;
      if(req.body.EmailContact == "EmailContact")
        contactByEmail = true;

      contacts.updateOne({_id : ObjectID(req.body.ConId)}, {$set: {prefix: req.body.Prefix, first: req.body.FirstName, last: req.body.LastName, street: req.body.Street, city: req.body.City, state: req.body.State, zip: req.body.Zip, phone: req.body.Phone, email: req.body.Email, mailContact: contactByMail, phoneContact: contactByPhone, emailContact: contactByEmail}});

      var message = "Contact updated successfully!"

      res.render('thanks', {message:message});
});

router.get('/delete', function(req, res, next) {
      var contacts = req.db.collection("contacts");

      contacts.deleteOne({_id : ObjectID(req.query.ConId)}, function(err) {
        if(!err)
        {
          contacts.find().toArray(function(err, info) {
            if(!err)
            {
              res.render('contacts', {contactList: info});
            }
            else
            {
                next(err);
            }
          });
        }
        else 
        {
          next(err);
        }
      });
});

module.exports = router;
