const decodeToken = require("./authenticator");

function isAdministrator(token) {
  return new Promise((resolve, reject) => {
    decodeToken(token, (err, payload) => {
      if (err) {
        reject();
      } else {
        console.log(token);
        console.log(payload.role);

        if (payload.role === 'ADMIN') {
          resolve();
        } else {
          reject();
        }
      }
    })
  })
}

// TODO: REQUIRES TESTING.
function isSelf(req, user) {
  const token = req.headers.authorization;

  return new Promise((resolve, reject) => {
    decodeToken(token, (err, payload) => {
      if (err) {
        reject();
      } else {
        if (payload.sub === user.sub) {
          resolve();
        } else {
          reject();
        }
      }
    })
  })
}

module.exports = {
  isAdministrator,
  isSelf
};
