const { Schema, model } = require('mongoose');

// Schema to create a user model
const  userSchema = new Schema(
  {
   username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/\w+@\w+(.\w{2,3})+/, "Invalid Email"]
    },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Thought',
      },
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

userSchema.virtual("friendCount").get(function() {
  return this.friends.length;
});

const User = model('User', userSchema);

module.exports = User;