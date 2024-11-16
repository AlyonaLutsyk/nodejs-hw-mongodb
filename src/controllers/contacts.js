import createHttpError from 'http-errors';
import contactsService from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { sortByList } from '../models/contact.js';

export const getContactsController = async (req, res) => {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query, sortByList);

            const contacts = await contactsService.getAllContacts({page, perPage, sortBy, sortOrder});
            res.status(200).json({
                status: 200,
                message: "Successfully found contacts!",
                data: contacts
            });
};
    

export const getContactsByIdController = async (req, res) => {
        const { contactId } = req.params;
        const contact = await contactsService.getContactById(contactId);
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
    const data = await contactsService.addContact(req.body);

    res.status(201).json({
        status: 201, message: "Successfully created a contact!",
        data,
    });
};


export const updateContactController = async (req, res) => {
    const { contactId } = req.params;
    const data = req.body;
    const updatedContact = await contactsService.updateContact(contactId, data);
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
    const deletedContact = await contactsService.deleteContact(contactId);
    if (!deletedContact) {
        throw createHttpError(404, "Contact not found");
    }
    res.status(204).send();
};