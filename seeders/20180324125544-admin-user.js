'use strict';
const bcrypt = require('bcrypt');
const uuid = require('uuid');

var saltRounds = 10;
var salt = bcrypt.genSaltSync(saltRounds);
var hash = bcrypt.hashSync(process.env.ADMIN_USER_PASSWORD, salt);

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Users', [{
          id: uuid(),
          name: process.env.ADMIN_USER_NAME,
          email: process.env.ADMIN_USER_EMAIL,
          role: 'admin',
          password: hash
      }], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Users', null, {})
  }
};
