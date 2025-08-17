
import jwt from 'jsonwebtoken';
import User from '../../models/User/User.js'; 

const protect = async (req, res, next) => {
  let token = null;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, token missing" });
  }

  try {
      
    const decode = jwt.verify(token, process.env.JWT_SECRET);
     req.user = await User.findById(decode.id).select('-password');
     

    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    next(); // let request continue to the route
  } catch (error) {
    return res.status(401).json({ message: "Not Authorized , token failed" });
  }
};

export { protect };
export default protect;