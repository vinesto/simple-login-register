import { UsersModel } from '../database/models/index.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const getUsers = async (req, res) => {
  try {
    const users = await UsersModel.findAll({
      attributes: ['id', 'name', 'email']
    })
    res.json(users)
  } catch (error) {
    console.log(error)
  }
}

const Register = async (req, res) => {
  const {
    name,
    email,
    password,
    confPassword
  } = req.body;

  if (password !== confPassword) return res.status(400).json({
    msg: "Password and confirm password not match"
  })

  const salt = await bcrypt.genSalt()
  const hashPassword = await bcrypt.hash(password, salt)
  try {
    await UsersModel.create({
      name: name,
      email: email,
      password: hashPassword,
    });
    res.json({
      msg: "Register Success"
    })
  } catch (error) {
    console.log(error)
  }
}

const Login = async (req, res) => {
  try {
    const user = await UsersModel.findAll({
      where: {
        email: req.body.email
      }
    });
    const match = await bcrypt.compare(req.body.password, user[0].password)
    if (!match) return res.status(400).json({
      msg: 'Wrong Password'
    })
    const userId = user[0].id
    const name = user[0].name
    const email = user[0].email
    const accessToken = jwt.sign({ userId, name, email }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '20s'
    });
    const refreshToken = jwt.sign({ userId, name, email }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: '1d'
    });
    await UsersModel.update({ token: refreshToken }, {
      where: {
        id: userId
      }
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000
    });
    res.json({ accessToken });
  } catch (error) {
    res.status(404).json({
      msg: "Email not found !!"
    });
  }
}

const Logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);
  const user = await UsersModel.findAll({
    where: {
      token: refreshToken
    }
  });
  if (!user[0]) return res.sendStatus(204);
  const userId = user[0].id;
  await UsersModel.update({ token: null }, {
    where: {
      id: userId
    }
  });
  res.clearCookie('refreshToken');
  return res.sendStatus(200);
}

export {
  getUsers,
  Register,
  Login,
  Logout
}