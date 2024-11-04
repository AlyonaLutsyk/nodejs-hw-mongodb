import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import contactsService from './services/contacts.js';

export const setupServer = () => {
    const app = express();

    app.use(cors());

    const logger = pino({
        transport: {
            target: 'pino-pretty',
        },
    });

    app.use(logger);


    app.get('/contacts', async (req, res) => {
        try {
            const contacts = await contactsService.getAllContacts();
            res.status(200).json({
                status: 200,
                message: "Successfully found contacts!",
                data: contacts
            });
        } catch {
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    app.get('/contacts/:contactId', async (req, res) => {
        const { contactId } = req.params;
        try {
            const contact = await contactsService.getContactById(contactId);
            if (contact) {
                res.status(200).json({
                    status: 200,
                    message: `Successfully found contact with id ${contactId}!`,
                    data: contact
                });
            } else {
                res.status(404).json({ message: 'Contact not found' });
            }
        } catch {
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    app.use((req, res) => {
        res.status(404).json({
            message: 'Not found',
        });
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};
