import Contact from "../models/contact.js";

const getAllContacts = () => Contact.find();
const getContactById = (id) => Contact.findById(id);

export default { getAllContacts, getContactById };


