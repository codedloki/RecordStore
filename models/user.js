const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: 'user'
  }
});

// Hash the password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (error) {
    return next(error);
  }
});

// Method to compare password for login
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    console.log('Password match:', isMatch);
    return isMatch;
  } catch (error) {
    console.log('Error in comparePassword:', error);
    return false;
  }
};

const User = mongoose.model('User', userSchema);

// Create a default admin user
async function createDefaultAdmin() {
  try {
    console.log('Attempting to create default admin user...');
    const adminExists = await User.findOne({ username: 'admin' });
    if (adminExists) {
      console.log('Admin user already exists.');
      return;
    }

    // ❗️ Don't manually hash password here
    //

    const adminUser = new User({
      username: 'kshitij',
      password: 'khade@06',
      role: 'admin'// Will be hashed by pre-save hook
    });
    await adminUser.save();
    console.log('Admin user created successfully.');
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

mongoose.connection.once('connected', () => {
  console.log('Mongoose connected, creating admin user...');
  createDefaultAdmin();
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

module.exports = User;
