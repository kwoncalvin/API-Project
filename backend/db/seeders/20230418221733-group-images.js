'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    options.tableName = 'GroupImages';
    return queryInterface.bulkInsert(options, [
      {
        groupId: 1,
        url: 'gpimg1.com',
        preview: true
      },
      {
        groupId: 1,
        url: 'gpimg2.com',
        preview: true
      },
      {
        groupId: 2,
        url: 'gpimg3.com',
        preview: false
      },
      {
        groupId: 2,
        url: 'gpimg4.com',
        preview: false
      },
      {
        groupId: 3,
        url: 'gpimg5.com',
        preview: false
      },
      {
        groupId: 3,
        url: 'gpimg6.com',
        preview: false
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'GroupImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: { [Op.in]: ['gpimg1.com', 'gpimg2.com', 'gpimg3.com', 'gpimg4.com', 'gpimg5.com', 'gpimg6.com'] }
    }, {});
  }
};
