const { User, Thought } = require('../models');

module.exports = {
  
  // Get all Users
  async getAllUsers (req, res) {
    try {
      const userData = await User.find();
      res.json(userData);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Get a User
  async getUser(req, res) {
    try {
      const userData = await User.findOne({ _id: req.params.userId })
        .select('-__v')
        .populate("friends")
        .populate("thoughts");

      if (!userData) {
        return res.status(404).json({ message: 'No user with that ID' });
      }

      res.json(userData);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Create a User
  async createUser(req, res) {
    try {
      const userData = await User.create(req.body);
      res.json(userData);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // Delete a User
  async deleteUser(req, res) {
    try {
      const userData = await User.findOneAndDelete({ _id: req.params.userId });

      if (!userData) {
        res.status(404).json({ message: 'No user with that ID' });
      }

      await Thought.deleteMany({ _id: { $in: userData.thoughts } });
      res.json({ message: 'User and thoughts deleted!' });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Update a User
  async updateUser(req, res) {
    try {
      const userData = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!userData) {
        res.status(404).json({ message: 'No user with this id!' });
      }

      res.json(userData);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Add Friend
  async addFriend(req, res) {
    console.log(req.body);
  
    try {
      const userData = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.params.friendId } },
        {  new: true }
      );
  
      if (!userData) {
        return res
          .status(404)
          .json({ message: 'No user found with that ID :(' });
      }
  
      res.json(userData);
    } catch (err) {
      if (err.name === 'CastError') {
        return res.status(400).json({ message: 'Invalid userId' });
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  
  // Remove Friend
  async removeFriend(req, res) {
    try {
      const userData = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId } },
        { new: true }
      );
  
      if (!userData) {
        return res
          .status(404)
          .json({ message: 'No user found with that ID :(' });
      }
  
      res.json(userData);
    } catch (err) {
      if (err.name === 'CastError') {
        return res.status(400).json({ message: 'Invalid userId' });
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};
