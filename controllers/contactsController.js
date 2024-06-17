import contactsService from "../services/contactsService.js";
import controllerWrapper from "../decorators/controllerWrapper.js";

const getAllContacts = async (req, res) => {
    try {
        const data = await contactsService.getContactList();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

const getOneContact = async (req, res) => {
    try {
        const { id } = req.params;
        const contact = await contactsService.getContactById(id);

        if (!contact) {
            res.status(404).json({ message: "Not found" });
            return;
        }

        res.status(200).json(contact);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

const deleteContact = async (req, res) => {
    try {
        const { id } = req.params;
        const contact = await contactsService.deleteContact(id);

        if (!contact) {
            res.status(404).json({ message: "Not found" });
            return;
        }

        res.status(200).json({ message: "Contact deleted" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

const createContact = async (req, res) => {
    try {
        const data = await contactsService.addContact(req.body);
        res.status(200).json({data: data});
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

const updateContact = async (req, res) => {
    try {
        const { id } = req.params;
        const contact = await contactsService.updateContact(id, req.body);

        if (!contact) {
            res.status(404).json({ message: "Not found" });
            return;
        }

        res.status(201).json(contact);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export default {
    getAllContacts: controllerWrapper(getAllContacts),
    getOneContact: controllerWrapper(getOneContact),
    deleteContact: controllerWrapper(deleteContact),
    createContact: controllerWrapper(createContact),
    updateContact: controllerWrapper(updateContact),
};
