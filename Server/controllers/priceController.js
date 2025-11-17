import Price from '../models/Price.js';

// @desc    Get all prices
// @route   GET /api/prices
// @access  Public
export const getPrices = async (req, res) => {
  try {
    const prices = await Price.find().sort({ date: -1 }).limit(100);

    res.json({
      success: true,
      count: prices.length,
      data: prices
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Get prices by crop and county
// @route   GET /api/prices/:crop/:county
// @access  Public
export const getPricesByCrop = async (req, res) => {
  try {
    const { crop, county } = req.params;

    const prices = await Price.find({ crop, county })
      .sort({ date: -1 })
      .limit(30);

    res.json({
      success: true,
      count: prices.length,
      data: prices
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Create new price entry
// @route   POST /api/prices
// @access  Private
export const createPrice = async (req, res) => {
  try {
    req.body.reportedBy = req.user._id;
    const price = await Price.create(req.body);

    res.status(201).json({
      success: true,
      data: price
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Update price
// @route   PUT /api/prices/:id
// @access  Private (Admin)
export const updatePrice = async (req, res) => {
  try {
    const price = await Price.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!price) {
      return res.status(404).json({ 
        success: false,
        message: 'Price not found' 
      });
    }

    res.json({
      success: true,
      data: price
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Delete price
// @route   DELETE /api/prices/:id
// @access  Private (Admin)
export const deletePrice = async (req, res) => {
  try {
    const price = await Price.findById(req.params.id);

    if (!price) {
      return res.status(404).json({ 
        success: false,
        message: 'Price not found' 
      });
    }

    await price.deleteOne();

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};