const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

const User = require('../models/User');
const Contact = require('../models/Contact');

//@route     GET api/contacts
//@desc      get all Users contacts
//@access    Private
router.get('/', auth, async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user.id }).sort({
      date: -1,
    });
    res.json(contacts);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server Error');
  }
});

//@route     POST api/contacts
//@desc      Add new Contacts
//@access    Private
router.post(
  '/',
  [auth, [check('name', 'Name is Required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, type } = req.body;

    try {
      const newContact = new Contact({
        name,
        email,
        phone,
        type,
        user: req.user.id,
      });

      const contact = await newContact.save();

      res.json(contact);
    } catch (error) {
      console.log(error.message);
      res.status(500).send('Server Error');
    }
  }
);

//@route     PUT api/contacts/:id
//@desc      Update Contact
//@access    Private
router.put('/:id', auth, async (req, res) => {
  const { name, email, phone, type } = req.body;

  //Build Contact Object
  const contactField = {};
  if (name) contactField.name = name;
  if (phone) contactField.phone = phone;
  if (email) contactField.email = email;
  if (type) contactField.type = type;

  try {
    let contact = await Contact.findById(req.params.id);

    if (!contact)
      return res.status(404).json({ msg: 'No such Contact Present' });

    //make sure user owns Contact
    if (contact.user.toString() !== req.user.id) {
      res.status(404).json({ msg: 'Not Authorized' });
    }

    contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { $set: contactField },
      { new: true }
    );

    res.json(contact);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server Error');
  }
});

//@route     DELETE api/contacts/:id
//@desc      Delete Contact
//@access    Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let contact = await Contact.findById(req.params.id);

    if (!contact)
      return res.status(404).json({ msg: 'No such Contact Present' });

    //make sure user owns Contact
    if (contact.user.toString() !== req.user.id) {
      res.status(404).json({ msg: 'Not Authorized' });
    }

    await Contact.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Conatct Deleted Successfully' });
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
