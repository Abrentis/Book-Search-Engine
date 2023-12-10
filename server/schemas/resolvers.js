// import user model
const { User } = require('../models');
// import sign token function from auth
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    user: async (parent, arg, context) => {
        if (context.user) {
            return User.findOne({ _id: context.user._id });
        }
        throw new Error('Must be logged in.');
    },
  },
  Mutation: {
    addUser: async (parent, { username, email, password }) => {
        const user = await User.create({ username, email, password });
        const token = signToken(user);
        return { token, user };
    },
    login: async (parent, { email, password }) => {
        const user = await User.findOne({ email });
        if (!user) {
          throw new Error('No user found.');
        }
        const correctPw = await user.isCorrectPassword(password);
        if (!correctPw) {
          throw new Error('Incorrect password');
        }
        const token = signToken(user);
        return { token, user };
    },
    saveBook: async (parent, args) => {
        if (context.user) {
            const updatedUser = await User.findByIdAndUpdate(
              { _id: context.user._id },
              { $addToSet: { savedBooks: bookData } },
              { new: true }
            );
            return updatedUser;
          }
          throw new Error('Must be logged in.');
    },
    removeBook: async (parent, { bookId }, context) => {
        if (context.user) {
            const updatedUser = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $pull: { savedBooks: { bookId } } },
            { new: true }
            );
            return updatedUser;
        }
        throw new Error('Must be logged in.');
    },
  },
};

module.exports = resolvers;
