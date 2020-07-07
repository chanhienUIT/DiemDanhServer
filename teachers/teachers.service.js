const config = require('../config.json')

const db = require('../_helpers/db')
const Teacher = db.Teacher

module.exports = {
  create,
  authenticate
}


async function create(req, res) {
  console.log("Teacher registers:");
  idToken = req.body.idToken;
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
      const teacher = new Teacher({ email: email, name: req.body.name, role: "giangvien", macAddr: req.body.macAddr });
      await teacher.save();
      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(401)
    }
  }
}

async function authenticate(req, res) {
  console.log("Teachers logins");
  idToken = req.body.idToken;
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
      res.send(await Teacher.findOne({email: email}));
    } catch (error) {
      console.log(error);
      res.sendStatus(401)
    }
  }
}