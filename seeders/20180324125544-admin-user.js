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
          password: hash,
          createdAt: '2018-01-01 00:00:00',
          updatedAt: '2018-01-01 00:00:00'
      }], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Users', null, {})
  }
};
