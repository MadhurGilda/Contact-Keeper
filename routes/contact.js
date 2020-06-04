const express = require('express');
const router = express.Router();

//@route     GET api/contacts
//@desc      get all Users contacts
//@access    Private
router.get('/', (req, res) => {
  res.send('get all Users contacts');
});

//@route     POST api/contacts
//@desc      Add new Contacts
//@access    Private
router.post('/', (req, res) => {
  res.send('add new contacts');
});

//@route     PUT api/contacts/:id
//@desc      Update Contact
//@access    Private
router.put('/:id', (req, res) => {
  res.send('Update contacts');
});

//@route     DELETE api/contacts/:id
//@desc      Delete Contact
//@access    Private
router.delete('/:id', (req, res) => {
  res.send('Delete contacts');
});

module.exports = router;
