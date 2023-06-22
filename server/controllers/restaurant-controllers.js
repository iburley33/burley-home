const { User } = require("../models");
const { signToken } = require("../utils/auth");
const fetch = require("node-fetch");
require('dotenv').config();


module.exports = {
  async getFavorites({ user }, res) {
    try {
      const foundUser = await User.findById(user._id).select(
        "savedRestaurants"
      );

      if (!foundUser) {
        return res
          .status(400)
          .json({ message: "Cannot find a user with this id!" });
      }

      res.json(foundUser.savedRestaurants);
    } catch (err) {
      console.error(err);
      return res.status(400).json(err);
    }
  },

  async saveRestaurant({ user, body }, res) {
    try {
      console.log(body);
      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { $addToSet: { savedRestaurants: body } },
        { new: true, runValidators: true }
      );
      console.log(updatedUser)

      if (!updatedUser) {
        return res.status(400).json({ message: "Something is wrong!" });
      }

      res.json(updatedUser);
    } catch (err) {
      console.error(err);
      return res.status(400).json(err);
    }
  },

  async deleteRestaurant({ user, params }, res) {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { $pull: { savedRestaurants: { restaurantId: params.restaurantId } } },
        { new: true }
      );

      if (!updatedUser) {
        return res
          .status(404)
          .json({ message: "Couldn't find user with this id!" });
      }

      res.json(updatedUser);
    } catch (err) {
      console.error(err);
      return res.status(400).json(err);
    }
  },

  async getRestaurants(req, res) {
    try {
      let userLatitude = req.body.latitude;
      let userLongitude = req.body.longitude;

      const response = await fetch(
        `https://api.foursquare.com/v2/venues/explore?client_id=${process.env.FOURSQUARE_CLIENT_ID}&client_secret=${process.env.FOURSQUARE_CLIENT_SECRET}&v=20230522&ll=${userLatitude},${userLongitude}&query=restaurant&radius=10000`
      );

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).send(error.message);
    }
  },
};
