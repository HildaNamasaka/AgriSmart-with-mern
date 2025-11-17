import Activity from '../models/Activity.js';

// @desc    Get all activities for logged in user
// @route   GET /api/activities
// @access  Private
export const getActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ user: req.user._id })
      .populate('farm', 'description')
      .sort({ date: -1 });

    res.json({
      success: true,
      count: activities.length,
      data: activities
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Get single activity
// @route   GET /api/activities/:id
// @access  Private
export const getActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id).populate('farm', 'description');

    if (!activity) {
      return res.status(404).json({ 
        success: false,
        message: 'Activity not found' 
      });
    }

    if (activity.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ 
        success: false,
        message: 'Not authorized' 
      });
    }

    res.json({
      success: true,
      data: activity
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Create new activity
// @route   POST /api/activities
// @access  Private
export const createActivity = async (req, res) => {
  try {
    req.body.user = req.user._id;
    const activity = await Activity.create(req.body);

    res.status(201).json({
      success: true,
      data: activity
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Update activity
// @route   PUT /api/activities/:id
// @access  Private
export const updateActivity = async (req, res) => {
  try {
    let activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ 
        success: false,
        message: 'Activity not found' 
      });
    }

    if (activity.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ 
        success: false,
        message: 'Not authorized' 
      });
    }

    activity = await Activity.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      data: activity
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Delete activity
// @route   DELETE /api/activities/:id
// @access  Private
export const deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ 
        success: false,
        message: 'Activity not found' 
      });
    }

    if (activity.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ 
        success: false,
        message: 'Not authorized' 
      });
    }

    await activity.deleteOne();

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