'use strict';
module.exports = (sequelize, DataTypes) => {
  var Poster = sequelize.define('Poster', {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV1, primaryKey: true, allowNull: false },
      title: DataTypes.STRING,
      tags: DataTypes.STRING,
      thumbnail: DataTypes.STRING,
      files: DataTypes.STRING,
      customerId: DataTypes.STRING,
  }, {});
  Poster.associate = function(models) {
    // associations can be defined here
  };
  return Poster;
};