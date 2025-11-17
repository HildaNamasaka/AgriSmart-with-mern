import Farm from '../models/Farm.js';

// @desc    Get all farms for logged in user
// @route   GET /api/farms
// @access  Private
export const getFarms = async (req, res) => {
  try {
    const farms = await Farm.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: farms.length,
      data: farms
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Get single farm
// @route   GET /api/farms/:id
// @access  Private
export const getFarm = async (req, res) => {
  try {
    const farm = await Farm.findById(req.params.id);

    if (!farm) {
      return res.status(404).json({ 
        success: false,
        message: 'Farm not found' 
      });
    }

    // Make sure user owns farm
    if (farm.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ 
        success: false,
        message: 'Not authorized to access this farm' 
      });
    }

    res.json({
      success: true,
      data: farm
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Create new farm
// @route   POST /api/farms
// @access  Private
export const createFarm = async (req, res) => {
  try {
    req.body.user = req.user._id;
    const farm = await Farm.create(req.body);

    res.status(201).json({
      success: true,
      data: farm
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Update farm
// @route   PUT /api/farms/:id
// @access  Private
export const updateFarm = async (req, res) => {
  try {
    let farm = await Farm.findById(req.params.id);

    if (!farm) {
      return res.status(404).json({ 
        success: false,
        message: 'Farm not found' 
      });
    }

    // Make sure user owns farm
    if (farm.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ 
        success: false,
        message: 'Not authorized to update this farm' 
      });
    }

    farm = await Farm.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      data: farm
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Delete farm
// @route   DELETE /api/farms/:id
// @access  Private
export const deleteFarm = async (req, res) => {
  try {
    const farm = await Farm.findById(req.params.id);

    if (!farm) {
      return res.status(404).json({ 
        success: false,
        message: 'Farm not found' 
      });
    }

    // Make sure user owns farm
    if (farm.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ 
        success: false,
        message: 'Not authorized to delete this farm' 
      });
    }

    await farm.deleteOne();

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