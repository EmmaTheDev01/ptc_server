import Contact from '../models/Contact.js';  // Import the Contact model
export const createContact = async (req, res) => {
    const { firstname, lastname, email, phone, message } = req.body;
  
    // Validate the request body
    if (!firstname || !lastname || !email || !phone || !message) {
      console.error('Validation failed:', { firstname, lastname, email, phone, message });  // Log validation issues
      return res.status(400).json({
        success: false,
        message: 'All fields are required.',
      });
    }
  
    // Ensure email is valid
    if (!/\S+@\S+\.\S+/.test(email)) {
      console.error('Invalid email address:', email);  // Log invalid email
      return res.status(400).json({
        success: false,
        message: 'Invalid email address.',
      });
    }
  
    try {
      const newContact = new Contact({
        firstname,
        lastname,
        email,
        phone,
        message,
      });
  
      const savedContact = await newContact.save();
      console.log('Contact created successfully:', savedContact);  // Log the saved contact
  
      res.status(201).json({
        success: true,
        message: 'Contact created successfully.',
        data: savedContact,
      });
    } catch (err) {
      console.error('Error creating contact:', err);  // Log the error
      res.status(500).json({
        success: false,
        message: 'Failed to create contact.',
        error: err.message,
      });
    }
  };
  

// Get all contact form submissions
export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });  // Sort by creation date descending
    console.log('Fetched all contacts:', contacts);  // Log fetched contacts

    res.status(200).json({
      success: true,
      message: 'All contacts retrieved successfully.',
      data: contacts,
    });
  } catch (err) {
    console.error('Error fetching contacts:', err);  // Log the error
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contacts.',
      error: err.message,
    });
  }
};
