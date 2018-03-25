'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Posters', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1
      },
      title: {
        type: Sequelize.STRING
      },
      tags: {
        type: Sequelize.STRING
      },
      thumbnail: {
        type: Sequelize.STRING
      },
        files: {
            type: Sequelize.STRING
        },
        customerId: {
            type: Sequelize.STRING
        },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Posters');
  }
};