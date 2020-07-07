const config = require('../config.json')

const db = require('../_helpers/db')
const User = db.User
const Teacher = db.Teacher

module.exports = {
  authenticate,
  create,
  update
}

async function authenticate(req, res) {
  var idToken = req.body.idToken;
  verify(idToken);
  async function verify(token) {
    const { OAuth2Client } = require('google-auth-library');
    const CLIENT_ID = config.CLIENT_ID;
    try {
      const client = new OAuth2Client(CLIENT_ID);
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID
      });
      const payload = ticket.getPayload();
      email = payload['email'];
      console.log("Authenticate:");
      console.log("Token :" + token);
      console.log("Email : " + email + " logins.")
      if (await User.exists({ email: email }) == true) {
        User.findOneAndUpdate({ email: email }, { profilepic: payload['picture'] }, { upsert: false }, function () { });
        res.json(await User.findOne({ email: email }))
      } else if (await Teacher.exists({ email: email }) == true) {
        profilepic = payload['picture'];
        const currentteacher = { email: email };
        const update = { profilepic: profilepic };
        Teacher.findOneAndUpdate(currentteacher, update, { upsert: true }, function () { });
        res.json(await Teacher.findOne({ email: email }))
      } else {
        res.sendStatus(404)
      }
    } catch (error) {
      console.log(error);
      res.sendStatus(401)
    }
  }
}

async function create(req, res) {
  console.log("User registers:");
  var idToken = req.body.idToken;
  verifyregister(idToken);
  async function verifyregister(token) {
    const { OAuth2Client } = require('google-auth-library');
    const CLIENT_ID = config.CLIENT_ID;
    try {
      const client = new OAuth2Client(CLIENT_ID);
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID
      });
      const payload = ticket.getPayload();
      email = payload['email'];
      mssv = email.split("@")[0];
      profilepic = payload['picture'];
      const user = new User({ email: email, name: req.body.name, role: "sinhvien", profilepic: profilepic, mssv: mssv });
      await user.save();
      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(401)
    }
  }
}

async function update(req, res) {
  console.log("User edits:");
  var idToken = req.body.idToken;
  console.log(req.body.idToken);
  verifyedit(idToken);
  async function verifyedit(token) {
    const { OAuth2Client } = require('google-auth-library');
    const CLIENT_ID = config.CLIENT_ID;
    try {
      const client = new OAuth2Client(CLIENT_ID);
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID
      });
      const payload = ticket.getPayload();
      email = payload['email'];
      name = req.body.name;
      console.log(name)
      const currentuser = { email: email };
      const update = { name: name };
      User.findOneAndUpdate(currentuser, update, { upsert: true }, function () { });
      res.sendStatus(200)
    } catch (error) {
      console.log(error);
      res.sendStatus(401)
    }
  }
}