import createHttpError from 'http-errors';
import contactsService from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { sortByList } from '../models/Contact.js';

export const getContactsController = async (req, res) => {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query, sortByList);
    const { _id: userId } = req.user;

            const contacts = await contactsService.getAllContacts({page, perPage, sortBy, sortOrder, filter: { userId }});
            res.status(200).json({
                status: 200,
                message: "Successfully found contacts!",
                data: contacts
            });
};
    

export const getContactsByIdController = async (req, res) => {
    const { contactId } = req.params;
    const { _id: userId } = req.user;
        const contact = await contactsService.getContactById(contactId, userId);
        if (!contact) {
            throw createHttpError(404, `Contact with id=${contactId} not found`);
        }
        res.status(200).json({
            status: 200,
            message: `Successfully found contact with id ${contactId}!`,
            data: contact
        });
};


export const addContactsController = async (req, res) => {
    const { _id: userId } = req.user;
    const data = await contactsService.addContact({ ...req.body, userId });

    res.status(201).json({
        status: 201, message: "Successfully created a contact!",
        data,
    });
};


export const updateContactController = async (req, res) => {
    const { contactId } = req.params;
    const data = req.body;
    const { _id: userId } = req.user;
    const updatedContact = await contactsService.updateContact(contactId, userId, data);
    if (!updatedContact) {
        throw createHttpError(404, "Contact not found");
    }
    res.status(200).json({
        status: 200,
        message: "Successfully patched a contact!",
        data: updatedContact
    });
};

export const deleteContactController = async (req, res) => {
    const { contactId } = req.params;
    const { _id: userId } = req.user;
    const deletedContact = await contactsService.deleteContact(contactId, userId);
    if (!deletedContact) {
        throw createHttpError(404, "Contact not found");
    }
    res.status(204).send();
};