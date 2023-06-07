const { ObjectId } = require('mongoose').Types;
const { Thought, User } = require('../models/');


module.exports = {
  
  // Get all thoughts
  async getAllThoughts(req, res) {
    try {
      const thoughtData = await Thought.find();

      res.json(thoughtData);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // Get a single thought
  async getThought(req, res) {
    try {
      const thoughtData = await Thought.findOne({ _id: req.params.thoughtId })
        .select('-__v');

      if (!thoughtData) {
        return res.status(404).json({ message: 'No thought with that ID' })
      }

      res.json(thoughtData,);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // create a new thought
  async createThought(req, res) {
    console.log("createThought")
    try {
      const thoughtData = await Thought.create(req.body);
      // res.json(thoughtData);
      if(thoughtData) {
        await User.findOneAndUpdate(
          { _id: req.params.thoughtId },
          { $push: {thoughts: thoughtData._id }},
          { new: true }
        );
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async updateThought(req, res) {
    try {
      const thoughtData = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!thoughtData) {
        res.status(404).json({ message: 'No thought with this id!' });
      }

      res.json(thoughtData);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Delete a thought
  async deleteThought(req, res) {
    try {
      const thoughtData = await Thought.findOneAndRemove({ _id: req.params.thoughtId });

      if (!thoughtData) {
        return res.status(404).json({ message: 'No such thought exists' });
      }

      const user = await User.findOneAndUpdate(
        { thoughts: req.params.thoughtId },
        { $pull: { thoughts: req.params.thoughtId } },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({
          message: 'Thought deleted, but no users found',
        });
      }

      res.json({ message: 'Thought successfully deleted' });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  async addReaction(req, res) {
    console.log('You are adding a reaction');
    console.log(req.body);
  
    try {
      const thoughtData = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
      );
  
      if (!thoughtData) {
        return res
          .status(404)
          .json({ message: 'No thought found with that ID :(' });
      }
  
      res.json(thoughtData);
    } catch (err) {
      if (err.name === 'CastError') {
        return res.status(400).json({ message: 'Invalid thoughtId' });
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  
  // Remove reaction
  async removeReaction(req, res) {
    try {
      const thoughtData = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { runValidators: true, new: true }
      );
  
      if (!thoughtData) {
        return res
          .status(404)
          .json({ message: 'No thought found with that ID :(' });
      }
  
      res.json(thoughtData);
    } catch (err) {
      if (err.name === 'CastError') {
        return res.status(400).json({ message: 'Invalid thoughtId' });
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};
