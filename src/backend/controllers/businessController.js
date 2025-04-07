
const Business = require('../models/businessModel');

// @desc    Create a business
// @route   POST /api/businesses
// @access  Private/Business
const createBusiness = async (req, res) => {
  try {
    const {
      name,
      type,
      description,
      contactEmail,
      contactPhone,
      address,
      website,
      industry,
      foundedYear,
      logoUrl,
      productsAndServices,
      financialStats,
    } = req.body;

    const business = new Business({
      name,
      type,
      description,
      contactEmail,
      contactPhone,
      address,
      website,
      industry,
      foundedYear,
      logoUrl,
      productsAndServices: productsAndServices || [],
      financialStats: financialStats || {},
      ownerId: req.user._id,
    });

    const createdBusiness = await business.save();
    res.status(201).json(createdBusiness);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all businesses
// @route   GET /api/businesses
// @access  Public
const getBusinesses = async (req, res) => {
  try {
    const { type, industry } = req.query;
    
    let query = {};
    
    if (type && type !== 'all') {
      query.type = type;
    }
    
    if (industry && industry !== 'all') {
      query.industry = industry;
    }
    
    const businesses = await Business.find(query);
    res.json(businesses);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get business by ID
// @route   GET /api/businesses/:id
// @access  Public
const getBusinessById = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    
    if (business) {
      res.json(business);
    } else {
      res.status(404);
      throw new Error('Business not found');
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @desc    Update a business
// @route   PUT /api/businesses/:id
// @access  Private/Business
const updateBusiness = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    
    if (business) {
      // Check if the user is the owner or an admin
      if (business.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(401);
        throw new Error('Not authorized to update this business');
      }
      
      business.name = req.body.name || business.name;
      business.type = req.body.type || business.type;
      business.description = req.body.description || business.description;
      business.contactEmail = req.body.contactEmail || business.contactEmail;
      business.contactPhone = req.body.contactPhone || business.contactPhone;
      business.address = req.body.address || business.address;
      business.website = req.body.website || business.website;
      business.industry = req.body.industry || business.industry;
      business.foundedYear = req.body.foundedYear || business.foundedYear;
      business.logoUrl = req.body.logoUrl || business.logoUrl;
      
      if (req.body.productsAndServices) {
        business.productsAndServices = req.body.productsAndServices;
      }
      
      if (req.body.financialStats) {
        business.financialStats = req.body.financialStats;
      }
      
      const updatedBusiness = await business.save();
      res.json(updatedBusiness);
    } else {
      res.status(404);
      throw new Error('Business not found');
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a business
// @route   DELETE /api/businesses/:id
// @access  Private/Business
const deleteBusiness = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    
    if (business) {
      // Check if the user is the owner or an admin
      if (business.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(401);
        throw new Error('Not authorized to delete this business');
      }
      
      await business.deleteOne();
      res.json({ message: 'Business removed' });
    } else {
      res.status(404);
      throw new Error('Business not found');
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createBusiness,
  getBusinesses,
  getBusinessById,
  updateBusiness,
  deleteBusiness,
};
