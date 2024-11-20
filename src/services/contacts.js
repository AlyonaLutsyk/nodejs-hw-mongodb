import Contact from "../models/Contact.js";

import { calculatePaginationData } from "../utils/calculatePaginationData.js";

const getAllContacts = async ({ page = 1, perPage = 10, sortBy = "_id", sortOrder = "asc" }) => {
    const skip = (page - 1) * perPage;
    const data = await Contact.find().skip(skip).limit(perPage).sort({ [sortBy]: sortOrder });
    const totalItems = await Contact.countDocuments();
    const paginationData = calculatePaginationData({ totalItems, page, perPage });
    return {
        data,
        ...paginationData,
    };
};
const getContactById = (id) => Contact.findById(id);
const addContact = payload => Contact.create(payload);
const updateContact = (id, data) => Contact.findByIdAndUpdate(id, data, { new: true });
const deleteContact = (id) => Contact.findByIdAndDelete(id);

export default { getAllContacts, getContactById, addContact, updateContact, deleteContact };


