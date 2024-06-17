import contactsService from "../services/contactsService.js";
import controllerWrapper from "../decorators/controllerWrapper.js";

const NOT_FOUND = { message: 'Not found' };

const getAllContacts = async (req, res) => {
    const { _id: owner } = req.user;
    const { page = 1, limit = 10, favorite } = req.query;
    const skip = limit * (page - 1);
    const filter = { owner };

    if (favorite) {
        filter.favorite = stringToBoolean(favorite);
    }

    const data = await contactsService.getContactList(filter, { skip, limit });

    res.status(200).json({
        qty: data.length,
        data
    });
};

const getOneContact = async (req, res) => {
    const { _id: owner } = req.user;
    const { id: _id } = req.params;
    const contact = await contactsService.getContact({ _id, owner });

    if (!contact) {
        return res.status(404).json(NOT_FOUND);
    }

    res.status(200).json(contact);
};

const deleteContact = async (req, res) => {
    const { _id: owner } = req.user;
    const { id: _id } = req.params;
    const contact = await contactsService.deleteContact({ _id, owner });

    if (!contact) {
        return res.status(404).json(NOT_FOUND);
    }

    res.status(200).json(contact);
};

const createContact = async (req, res) => {
    const { _id: owner } = req.user;
    const data = await contactsService.addContact({ ...req.body, owner });

    res.status(201).json(data);
};

const updateContact = async (req, res) => {
    const { _id: owner } = req.user;
    const { id: _id } = req.params;
    const contact = await contactsService.updateContact({ _id, owner }, req.body);

    if (!contact) {
        return res.status(404).json(NOT_FOUND);
    }

    res.status(200).json(contact);
};

const updateFavorite = async (req, res) => {
    const { _id: owner } = req.user;
    const { id: _id } = req.params;
    const { favorite: qFavorite } = req.query;
    const favorite = stringToBoolean(qFavorite);

    const contact = await contactsService.updateContact({ _id, owner }, { favorite });

    if (!contact) {
        return res.status(404).json(NOT_FOUND);
    }

    res.status(200).json(contact);
};

const stringToBoolean = value => Boolean(value.replace(/\s*(false|null|undefined|0)\s*/i, ''));

export default {
    getAllContacts: controllerWrapper(getAllContacts),
    getOneContact: controllerWrapper(getOneContact),
    deleteContact: controllerWrapper(deleteContact),
    createContact: controllerWrapper(createContact),
    updateContact: controllerWrapper(updateContact),
    updateFavorite: controllerWrapper(updateFavorite),
};
