import { Router } from "express";
import * as contactsController from "../controllers/contacts.js";
import ctrlWrapper from "../utils/ctrlWrapper.js";
import validateBody from "../utils/validateBody.js";
import { contactAddSchema, contactUpdateSchema } from "../validation/contacts.js";
import { isValidId } from "../middlewares/isValidId.js";
import { authenticate } from "../middlewares/authenticate.js";

const contactsRouter = Router();

contactsRouter.use(authenticate);

contactsRouter.get('/', ctrlWrapper(contactsController.getContactsController ));

contactsRouter.get('/:contactId', isValidId, ctrlWrapper(contactsController.getContactsByIdController));

contactsRouter.post('/', validateBody(contactAddSchema), ctrlWrapper(contactsController.addContactsController));

contactsRouter.patch('/:contactId', isValidId, validateBody(contactUpdateSchema), ctrlWrapper(contactsController.updateContactController));

contactsRouter.delete('/:contactId', isValidId, ctrlWrapper(contactsController.deleteContactController));
    
export default contactsRouter;