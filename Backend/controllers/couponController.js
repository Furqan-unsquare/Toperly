import Coupon from '../models/Coupon.js';
import Course from '../models/Course.js';

export const createCoupon = async (req, res) => {
  try {
    const { code, discountPercentage, course, expiryDate, usageLimit } = req.body;

    if (course) {
      const courseExists = await Course.findById(course);
      if (!courseExists) return res.status(404).json({ error: 'Course not found' });
    }

    const newCoupon = new Coupon({ code, discountPercentage, course, expiryDate, usageLimit });
    await newCoupon.save();

    res.status(201).json(newCoupon);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().populate('course');
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id).populate('course');
    if (!coupon) return res.status(404).json({ error: 'Coupon not found' });
    res.json(coupon);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateCoupon = async (req, res) => {
  try {
    const { code, discountPercentage, course, expiryDate, usageLimit } = req.body;

    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ error: 'Coupon not found' });

    if (course) {
      const courseExists = await Course.findById(course);
      if (!courseExists) return res.status(404).json({ error: 'Course not found' });
    }

    coupon.code = code || coupon.code;
    coupon.discountPercentage = discountPercentage ?? coupon.discountPercentage;
    coupon.course = course ?? coupon.course;
    coupon.expiryDate = expiryDate ?? coupon.expiryDate;
    coupon.usageLimit = usageLimit ?? coupon.usageLimit;

    await coupon.save();
    res.json(coupon);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return res.status(404).json({ error: 'Coupon not found' });
    res.json({ message: 'Coupon deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const validateCoupon = async (req, res) => {
  try {
    const { code, courseId } = req.body;

    const coupon = await Coupon.findOne({ code });
    if (!coupon) return res.status(404).json({ error: 'Invalid coupon code' });

    if (new Date(coupon.expiryDate) < new Date()) {
      return res.status(400).json({ error: 'Coupon expired' });
    }

    if (coupon.usageLimit <= coupon.usedCount) {
      return res.status(400).json({ error: 'Coupon usage limit exceeded' });
    }

    if (coupon.course && coupon.course.toString() !== courseId) {
      return res.status(400).json({ error: 'Coupon not applicable for this course' });
    }

    res.json({ success: true, discountPercentage: coupon.discountPercentage });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
