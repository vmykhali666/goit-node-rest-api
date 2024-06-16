import fs from 'fs/promises';
import { nanoid } from 'nanoid';
import path from 'path';

const contactsPath = path.resolve('db', 'contacts.json');

const readContacts = async () => {
    const contactsData = await fs.readFile(contactsPath, 'utf-8');
    return JSON.parse(contactsData);
};

const writeContacts = async (contacts) => {
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
};

const getContactList = async () => {
    const contacts = await readContacts();
    return contacts;
};

const getContactById = async (contactId) => {
    const contacts = await readContacts();
    const contact = contacts.find((item) => item.id === contactId);
    return contact || null;
};

const removeContact = async (contactId) => {
    const contacts = await readContacts();
    const index = contacts.findIndex((contact) => contact.id === contactId);
    if (index === -1) return null;
    const [removedContact] = contacts.splice(index, 1);
    await writeContacts(contacts);
    return removedContact;
};

const addContact = async ({ name, email, phone }) => {
    const contacts = await readContacts();
    const newContact = { id: nanoid(), name, email, phone };
    contacts.push(newContact);
    await writeContacts(contacts);
    return newContact;
};

const updateContact = async (id, newContact) => {
    const contacts = await readContacts();
    const index = contacts.findIndex((contact) => contact.id === id);
    if (index === -1) {
        return null;
    }
    const contact = contacts[index];
    contacts[index] = {
        ...contact,
        ...newContact,
    };
    await writeContacts(contacts);
    return contacts[index];
};

export default {
    getContactList,
    getContactById,
    removeContact,
    addContact,
    updateContact,
};
