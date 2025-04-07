const userModel = require("../models/userModel");

// Update signup function to include role
async function signup(req, res) {
  try {
    let { email, role } = req.body;
    let user = req.body;
    
    // Validate role
    const validRoles = ['startup', 'investor', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).send({
        message: "Invalid role specified"
      });
    }

    const fetchedUser = await userModel.findOne({ email });

    if (fetchedUser) {
      return res.status(200).send("User exists!");
    }

    let userAdded = await userModel.create(user);
    res.status(200).send(userAdded);
  } catch (error) {
    res.status(500).send({
      message: "Server error:" + error,
    });
  }
}

// Update login function to include role information
async function login(req, res) {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const loggedInUser = await userModel.findOne({ email });
    console.log("Login attempt for:", email, "- User found:", !!loggedInUser);

    if (!loggedInUser) {
      return res.status(404).json({
        message: "User not found!"
      });
    }

    if (password === loggedInUser.password) {
      // Return a response with user details
      return res.status(200).json({
        message: "User logged in successfully!",
        user: {
          name: loggedInUser.name,
          email: loggedInUser.email,
          role: loggedInUser.role || "startup",
          gender: loggedInUser.gender,
          address: loggedInUser.address || ""
        }
      });
    } else {
      return res.status(401).json({
        message: "Email or password not authenticated!"
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Server error during login",
      error: error.message
    });
  }
}
  
async function forgotPassword(req, res) {
    try {
        let { password} = req.body;
        await userModel.findOneAndUpdate(
            { email: req.query.email },
            { $set: { password: password } }
        );
    
        res.status(200).send({
          message: 'Password changed'
        });
      } catch (err) {
        res.status(500).send({
          message: "Server error:" + error,
        });
      }
};

// Update fetchUserByEmail function to include role in the aggregation
async function fetchUserByEmail(req, res) {
  try {
    let getUser = await userModel.aggregate([
      {
        $match: { email: req.query.email }
      },
      {
        $project: {
          name: 1,
          email: 1,
          password: 1,
          gender: 1,
          address: 1,
          role: 1  // Make sure role is included
        }
      }
    ]);

    res.status(200).send(getUser);
  } catch (err) {
    res.status(500).send({
      message: "Server error:" + err,
    });
  }
};

// Update the updateUserProfile function to handle role
async function updateUserProfile(req, res) {
  try {
    let { name, password, address, gender, role } = req.body;
    await userModel.findOneAndUpdate(
      { email: req.query.email },
      { $set: { 
        "name": name, 
        "password": password, 
        "address": address,
        "gender": gender,
        "role": role
      }}
    );
    res.status(200).send({
      message: 'Profile updated!'
    });
  } catch (err) {
    return res.status(500).json({
      message: "Server error:" + err,
    });
  }
}

// New function to get all users
async function getAllUsers(req, res) {
    try {
        const users = await userModel.find({}, { name: 1, email: 1, _id: 0 });
        
        return res.status(200).json({
            success: true,
            users: users
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching users",
            error: error.message
        });
    }
};

module.exports = {
    signup: signup,
    login: login,
    forgotPassword:forgotPassword,
    fetchUserByEmail:fetchUserByEmail,
    updateUserProfile:updateUserProfile,
    getAllUsers: getAllUsers,
};
