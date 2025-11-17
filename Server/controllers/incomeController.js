import Income from '../models/Income.js';

// @desc    Get all income for logged in user
// @route   GET /api/income
// @access  Private
export const getIncomes = async (req, res) => {
  try {
    const incomes = await Income.find({ user: req.user._id })
      .populate('farm', 'description')
      .sort({ date: -1 });

    res.json({
      success: true,
      count: incomes.length,
      data: incomes
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Get single income
// @route   GET /api/income/:id
// @access  Private
export const getIncome = async (req, res) => {
  try {
    const income = await Income.findById(req.params.id).populate('farm', 'description');

    if (!income) {
      return res.status(404).json({ 
        success: false,
        message: 'Income record not found' 
      });
    }

    if (income.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ 
        success: false,
        message: 'Not authorized' 
      });
    }

    res.json({
      success: true,
      data: income
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Create new income
// @route   POST /api/income
// @access  Private
export const createIncome = async (req, res) => {
  try {
    req.body.user = req.user._id;
    const income = await Income.create(req.body);

    res.status(201).json({
      success: true,
      data: income
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Update income
// @route   PUT /api/income/:id
// @access  Private
export const updateIncome = async (req, res) => {
  try {
    let income = await Income.findById(req.params.id);

    if (!income) {
      return res.status(404).json({ 
        success: false,
        message: 'Income record not found' 
      });
    }

    if (income.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ 
        success: false,
        message: 'Not authorized' 
      });
    }

    income = await Income.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      data: income
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Delete income
// @route   DELETE /api/income/:id
// @access  Private
export const deleteIncome = async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);

    if (!income) {
      return res.status(404).json({ 
        success: false,
        message: 'Income record not found' 
      });
    }

    if (income.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ 
        success: false,
        message: 'Not authorized' 
      });
    }

    await income.deleteOne();

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