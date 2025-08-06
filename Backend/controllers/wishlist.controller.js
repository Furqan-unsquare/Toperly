import Wishlist from '../models/Wishlist.js';

export const getUserWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const wishlist = await Wishlist.find({ student: userId }).populate('course');

    res.json(wishlist.map(w => w.course));
  } catch (err) {
    res.status(500).json({ message: 'Failed to get wishlist' });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const exists = await Wishlist.findOne({ student: userId, course: courseId });
    if (exists) return res.status(400).json({ message: 'Already in wishlist' });

    const wish = new Wishlist({ student: userId, course: courseId });
    await wish.save();

    res.status(201).json({ message: 'Added to wishlist' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add to wishlist' });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    await Wishlist.findOneAndDelete({ student: userId, course: courseId });

    res.json({ message: 'Removed from wishlist' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to remove from wishlist' });
  }
};


export const getMywishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const wishlist = await Wishlist.find({ student: userId }).populate({
      path: 'course',
      populate: { path: 'instructor' }
    });

    const courses = wishlist.map(w => w.course);

    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch wishlist courses' });
  }
}