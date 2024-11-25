import Contact from "../models/Contact.js";
import { calculatePaginationData } from "../utils/calculatePaginationData.js";


const getAllContacts = async ({ page = 1, perPage = 10, sortBy = "_id", sortOrder = "asc", filter = {} }) => {
    const skip = (page - 1) * perPage;
    const data = await Contact.find(filter)
        .skip(skip)
        .limit(perPage)
        .sort({ [sortBy]: sortOrder });

    const totalItems = await Contact.countDocuments(filter);

    const paginationData = calculatePaginationData({ totalItems, page, perPage });

    return {
        data,
        ...paginationData,
    };
};
const getContactById = (id, userId) => {
   
    return Contact.findOne({ _id: id, userId });
};


const addContact = (payload) => {
    return Contact.create(payload);
};


const updateContact = async (id, data, userId) => {
    return Contact.findOneAndUpdate(
        { _id: id, userId },
        data, 
        { new: true } 
    );
};


const deleteContact = (id, userId) => {
    
    return Contact.findOneAndDelete({ _id: id, userId });
};

export default { getAllContacts, getContactById, addContact, updateContact, deleteContact };


