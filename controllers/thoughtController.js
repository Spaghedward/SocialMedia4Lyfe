const { Thought, User } = require('../models');

module.exports = {
    async getThoughts(req, res) {
        try {
            const thoughts = await Thought.find()
            res.json(thoughts);
        } catch (err) {
            console.error(err);
            return res.status(500).json(err);
        }
    },

    async getSingleThought(req, res) {
        try {
            const thought = await Thought.findOne({ _id: req.params.thoughtId });
            !thought
                ? res.status(404).json({ message: 'No thought with that ID' })
                : res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async createThought(req, res) {
        try {
            const thought = await Thought.create(req.body);

            const user = await User.findOneAndUpdate(
                { username: req.body.username },
                { $push: { thoughts: thought._id } },
                { new: true }
            );
            res.status(201).json({thought, user, message: 'Thought Created.'});
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    async updateThought(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $set: req.body },
                { runValidators: true, new: true }
            );

            if (!thought) {
                return res.status(404).json({ message: 'No thought with this id!' });
            }

            res.json(thought);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    async deleteThought(req, res) {
        try {
            // Find the thought to be deleted
            const thought = await Thought.findOneAndRemove({ _id: req.params.thoughtId });
    
            // Check if the thought was found and deleted
            if (!thought) {
                return res.status(404).json({ message: 'No thought with this id!' });
            }
    
            // Find the user and remove the thought from their thoughts array
            const user = await User.findOneAndUpdate(
                { username: req.params.username },
                { $pull: { thoughts: req.params.thoughtId } },
                { new: true }
            );
    
            // Check if the user was found and updated
            if (!user) {
                return res.status(404).json({ error: 'User not found.' });
            }
    
            // Send a valid HTTP response
            res.json({ message: 'Thought deleted.', thought, user });
        } catch (err) {
            // Handle errors and send an appropriate HTTP response
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    

    async createReaction(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $addToset: { reactions: req.params.reactionId } },
                { new: true }
            );

            if (!thought) {
                return res.status(404).json({ message: 'No thought with this id!' });
            }

            res.status(201).json({ thought, message: 'Reaction Added.' });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    async deleteReaction(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $pull: { reactions: req.params.reactionId } },
                { new: true }
            );

            if (!thought) {
                return res.status(404).json({ message: 'No thought with this id!' });
            }
            res.status(204).json({ message: 'Removed Reaction' });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },
};
