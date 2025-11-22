import Contact from "../../models/contactus/ContactUs.model.js";

export const createContact = async (req, res) => {
  try {
    const { email, type, headline, message } = req.body;

    const newContact = await Contact.create({ email, type, headline, message });

    res.status(201).json({
      success: true,
      message: "Contact message created successfully",
      data: newContact,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getContacts = async (req, res) => {
  try {
    const { type, startDate, endDate } = req.query;

    let filter = {};

    if (type) {
      filter.type = type;
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const contacts = await Contact.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
