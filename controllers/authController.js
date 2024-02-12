const Users = require("../models/userModel");
const Orders = require("../models/orderModel");
const JWT = require("jsonwebtoken");

const authHelper = require("../helpers/authHelper");

function validateRequiredFields(fields, res) {
  for (const field of fields) {
    if (!field.value) {
      return res.send({ message: `${field.name} is required` });
    }
  }
}

const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, question, address } = req.body;
    //validation
    validateRequiredFields(
      [
        { name: "Name", value: name },
        { name: "E-mail", value: email },
        { name: "password", value: password },
        { name: "phone", value: phone },
        { name: "address", value: address },
        { name: "question", value: question },
        // Add more fields as needed
      ],
      res
    );

    //check user
    const existingUser = await Users.findOne({ email });
    //existing user
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "Already Registered please login",
      });
    }
    //register User
    const hashedPassword = await authHelper.hashPassword(password);
    //save
    const user = await new Users({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      question,
    }).save();
    //res
    res.status(201).send({
      success: true,
      message: "User Registor Sucessfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Registration",
      error,
    });
  }
};

//login || method Post
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email and password",
      });
    }
    //check user
    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registered",
      });
    }
    const match = await authHelper.comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }

    //token
    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(200).send({
      success: true,
      message: "Login Sucessfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

const forgotPasswordController = async (req, res) => {
  try {
    const { email, question, newPassword } = req.body;
    validateRequiredFields(
      [
        { name: "E-mail", value: email },
        { name: "newPassword", value: newPassword },
        { name: "question", value: question },

        // Add more fields as needed
      ],
      res
    );
    const user = await Users.findOne({ email, question });
    //validation
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "wrong Email or Answer" });
    }

    const hashed = await authHelper.hashPassword(newPassword);
    await Users.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "Password Reset Successfull",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something Went Wrong",
      error,
    });
  }
};

const testController = (req, res) => {
  res.send("test controller");
};

//update profile controller
const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const user = await Users.findById(req.user._id);

    //password check and update
    if (password && password.length < 6) {
      return res.json({ error: "Passsword is required and 6 character long" });
    }

    const hashedPassword = password
      ? await authHelper.hashPassword(password)
      : undefined;

    const updatedUser = await Users.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );

    //response
    res.status(200).send({
      success: true,
      message: "Profile Updated SUccessfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error WHile Update profile",
      error,
    });
  }
};
//orders
const getOrdersController = async (req, res) => {
  try {
    const orders = await Orders.find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    console.log(`orders called ${orders}`);
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
};

//orders
const getAllOrdersController = async (req, res) => {
  try {
    const orders = await Orders.find({})
      .populate("products", "-photo")
      .populate("buyer", "name");

    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
};
//order status

const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await Orders.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Updateing Order",
      error,
    });
  }
};

exports.registerController = registerController;
exports.loginController = loginController;
exports.forgotPasswordController = forgotPasswordController;
exports.testController = testController;
exports.updateProfileController = updateProfileController;
exports.getOrdersController = getOrdersController;
exports.getAllOrdersController = getAllOrdersController;
exports.orderStatusController = orderStatusController;
