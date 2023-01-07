const express = require('express')
const contacts = require("../../controllers/contacts.js")
const Joi = require("joi");
const authenticate = require("../../middlewares/authenticate")

const addSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});

const router = express.Router()

router.get('/', authenticate, async (req, res, next) => {
  const contactList = await contacts.listContacts();
  res.json({
    status: "success",
    code: 200,
    data: {
      contactList,
    },
  });
})

router.get('/:contactId', authenticate, async (req, res, next) => {
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

router.post('/', authenticate, async (req, res, next) => {
  const { error } = addSchema.validate(req.body);
  const { name, email, phone, favorite = false } = req.body;
  const {_id: owner} = req.user;

  if (error) {
    return res.status(400).json({ message: "missing required name field" });
  }
  
  const newContact = await contacts.addContact({ name, email, phone, favorite, owner });
  res.status(201).json({
    status: "success",
    code: 201,
    data: { newContact },
  });

})

router.delete('/:contactId', authenticate, async (req, res, next) => {
  const { contactId } = req.params;
  const deletedContact = await contacts.removeContact(contactId);
  if (!deletedContact) {
    return res.status(404).json({ message: "Not found" });
  }
  res.status(200).json({ message: "contact deleted" });
})

router.put('/:contactId', authenticate, async (req, res, next) => {
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

router.patch("/:contactId/favorite", authenticate, async (req, res, next) => {
  const { contactId } = req.params;
  const { favorite: body } = req.body;

  if (body === null) {
    return res.status(400).json({ message: "missing field favorite" });
  }
  const updatedStatus = await contacts.updateStatusContact(contactId, body);
  if (!updatedStatus) {
    return res.status(404).json({ message: "Not found" });
  }
  res.json({
    status: "success",
    code: 200,
    data: { updatedStatus },
  });
});

module.exports = router
