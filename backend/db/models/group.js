'use strict';
const {
  Model
} = require('sequelize');
const { Membership } = require('../models');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Group.belongsTo(models.User, {as: "Organizer"}, {foreignKey: 'organizerId'});
      Group.hasMany(
        models.Event,
        {foreignKey: 'groupId', onDelete: 'CASCADE',  hooks: true}
      );
      Group.hasMany(
        models.Venue,
        {foreignKey: 'groupId', onDelete: 'CASCADE',  hooks: true}
      );
      Group.hasMany(
        models.GroupImage,
        {foreignKey: 'groupId', onDelete: 'CASCADE',  hooks: true}
      );
      Group.hasMany(
        models.Membership,
        {foreignKey: 'groupId', onDelete: 'CASCADE',  hooks: true}
      );
    }
  }
  Group.init({
    organizerId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    name: DataTypes.STRING,
    about: DataTypes.TEXT,
    type: {
      type: DataTypes.ENUM,
      values: ['Online', 'In Person']
    },
    private: DataTypes.BOOLEAN,
    city: DataTypes.STRING,
    state: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Group'
  });
  return Group;
};
