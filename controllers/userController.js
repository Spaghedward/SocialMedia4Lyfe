const { User } = require('../models');

module.exports = {
  async getUsers(req, res) {
    try {
      const users = await User.find()
      res.json(users);
    } catch (err) {
      console.error({ message: err });
      return res.status(500).json(err);
    }
  },
  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId })
      .populate([
        { path: 'thought', select: '-__v' },
        { path: 'friends', select: 'username' }
    ]);
      !user
        ? res.status(404).json({ message: 'No user with that ID' })
        : res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async deleteUser(req, res) {
    try {
        const user = await User.findOneAndRemove({ _id: req.params.userId });

        if (!user) {
            return res.status(404).json({ message: 'No user with this id!' });
          }
    res.json({ message: 'User Deleted' });
    } catch (err) {
        res.status(500).json(err);
    }
  },

  async updateUser(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!user) {
        return res.status(404).json({ message: 'No user with this id!' });
      }

      res.json(user);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  async createFriend(req, res) {
    try {
        const friend = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToset:{ friends: req.params.friendId} },
            { new: true }  
        );

        if (!friend) {
            return res.status(404).json({ message: 'No user with this id!' });
        }

          res.status(201).json({ friend, message: 'Friend Added.' });
    } catch (err) {
        console.log(err);
      res.status(500).json(err);
    }
  }
};
