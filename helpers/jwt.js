const jwt = require('jsonwebtoken');

exports.generateToken = (user) => {
  const payload = {
    userId: user._id,
    name: user.name,
    email: user.email,
  };

  const token = jwt.sign(payload, 'your_secret_key', { expiresIn: '1h' });

  return token;
};
