const express = require('express')
const contacts = require("../../models/contacts.js")
const Joi = require("joi");

const addSchema = Joi.object({
  name: Joi.string().required(),
  phone: Joi.string().min(7).max(12).required(),
  email: Joi.string().email().required(),
});

const router = express.Router()

router.get('/', async (req, res, next) => {
  const contactList = await contacts.listContacts();
  res.json({
    status: "success",
    code: 200,
    data: {
      contactList,
    },
  });
})

router.get('/:contactId', async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await contacts.getContactById(contactId);
  if (!contact) {
    return res.status(404).json({ message: "Not found" });
  }

  res.json({
    status: "success",
    code: 200,
    data: { contact },
  });
})

router.post('/', async (req, res, next) => {
  const { error } = addSchema.validate(req.body);
  const { name, email, phone } = req.body;

  if (error) {
    return res.status(400).json({ message: "missing required name field" });
  }
  const newContact = await contacts.addContact({ name, email, phone });
  res.status(201).json({
    status: "success",
    code: 201,
    data: { newContact },
  });

})

router.delete('/:contactId', async (req, res, next) => {
  const { contactId } = req.params;
  const deletedContact = await contacts.removeContact(contactId);
  if (!deletedContact) {
    return res.status(404).json({ message: "Not found" });
  }
  res.status(200).json({ message: "contact deleted" });
})

router.put('/:contactId', async (req, res, next) => {
  const { error } = addSchema.validate(req.body);
  const { name, email, phone } = req.body;
  const { contactId } = req.params;

  if (error) {
    return res.status(400).json({ message: "missing fields" });
  }
  const updatedContact = await contacts.updateContact(contactId, {
    name,
    email,
    phone,
  });
  if (!updatedContact) {
    return res.status(404).json({ message: "Not found" });
  }
  res.json({
    status: "success",
    code: 200,
    data: { updatedContact },
  });

  res.json({ message: 'template message' })
})

module.exports = router
