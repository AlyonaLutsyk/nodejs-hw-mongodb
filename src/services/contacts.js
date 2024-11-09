import Contact from "../models/contact.js";

const getAllContacts = () => Contact.find();
const getContactById = (id) => Contact.findById(id);
const addContact = payload => Contact.create(payload);
const updateContact = (id, data) => Contact.findByIdAndUpdate(id, data, { new: true });
const deleteContact = (id) => Contact.findByIdAndDelete(id);

export default { getAllContacts, getContactById, addContact, updateContact, deleteContact };


