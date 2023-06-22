const { AuthenticationError } = require('apollo-server-express');
const { User, Restaurant } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    user: async () => {
      // Populate the professor subdocument when querying for classes
      return await User.find({}).populate('restaurant');
    },
    restaurant: async () => {
      return await Restaurant.find({});
    }

  },
  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
    // may need a TA for this one. Kinda sketchy.
    addFavorite: async (parent, { name, address }, context) => {
      console.log(context);
      if (context.user) {
        const favorite = new Restaurant({ name, address });

        await User.findByIdAndUpdate(context.user._id, { $push: { name: name, address: address } });

        return favorite;
      }

      throw new AuthenticationError('Not logged in');
    },
    updateUser: async (parent, args, context) => {
      if (context.user) {
        return await User.findByIdAndUpdate(context.user._id, args, { new: true });
      }

      throw new AuthenticationError('Not logged in');
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);

      return { token, user };
    }
  }
};

module.exports = resolvers;
