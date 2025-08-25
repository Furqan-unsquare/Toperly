import Contact from '../models/Query.js';

// Create a new contact
export const createContact = async (req, res) => {
  try {
    const { name, email, mobile, message, status } = req.body;
    const newContact = new Contact({ name, email, mobile, message, status });
    await newContact.save();
    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Read all contacts
export const getAllContacts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
      ];
    }
    if (status) {
      query.status = status;
    }
    const contacts = await Contact.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Contact.countDocuments(query);
    res.status(200).json({ contacts, total });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Read a single contact by ID
export const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update a contact by ID
export const updateContact = async (req, res) => {
  try {
    const { name, email, mobile, message, status } = req.body;
    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      { name, email, mobile, message, status },
      { new: true, runValidators: true }
    );
    if (!updatedContact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.status(200).json(updatedContact);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete a contact by ID
export const deleteContact = async (req, res) => {
  try {
    const deletedContact = await Contact.findByIdAndDelete(req.params.id);
    if (!deletedContact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.status(200).json({ message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};