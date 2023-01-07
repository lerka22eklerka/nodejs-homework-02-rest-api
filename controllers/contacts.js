const {Contact} = require('../models/contactModel')

const listContacts = async (id) => {
  try {
    const contacts = await Contact.find({owner: id});
  return contacts;
  } catch(err) {
console.log(err);
  }
}

const getContactById = async (req, res, next) => {
  try {
    const { contactId } = req.body;
     const {_id: owner} = req.user;
    const user = await Contact.find(owner);
  const response = user.filter(contact => contact._id === contactId );
  if (!response) {
    return null;
  }
  return response;
  } catch (err) {
    console.log(err);
  }
}

const removeContact = async (contactId) => {
  try {
  const deletedContact = Contact.findByIdAndDelete(contactId);
  return deletedContact;
  } catch (err) {
    console.log(err);
  }
}

const addContact = async ({ name, email, phone, favorite, owner }) => {
  try {
    const newContact = new Contact({ name, email, phone, favorite, owner });
    await newContact.save();
    return newContact;
  } catch (err) {
    console.log(err);
  }
};

const updateContact = async (contactId, body) => {
  try {
   const result = await Contact.findByIdAndUpdate(contactId, body, {
     new: true,
   });
    return result;
  } catch (err) {
    console.log(err);
  }
}

const updateStatusContact = async (contactId, favorite) => {
  try {
 const result = await Contact.findByIdAndUpdate(contactId, {favorite}, {
    new: true,
  });
  return result;
  } catch (err) {
    console.log(err);
  }
 
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
