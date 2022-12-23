const {Contact} = require('../db/contactModel')

const listContacts = async () => {
  try {
  const contacts = await Contact.find({});
  return contacts;
  } catch(err) {
console.log(err);
  }
}

const getContactById = async (contactId) => {
  try {
  const response = Contact.findById(contactId);
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

const addContact = async ({ name, email, phone }) => {
  try {
    const newContact = new Contact({ name, email, phone });
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
