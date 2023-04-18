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
    options.tableName = 'Memberships';
    return queryInterface.bulkInsert(options, [
      {
        userId: 1,
        groupId: 1,
        status: 'cohost'
      },
      {
        userId: 1,
        groupId: 2,
        status: 'pending'
      },
      {
        userId: 2,
        groupId: 2,
        status: 'member'
      },
      {
        userId: 2,
        groupId: 3,
        status: 'cohost'
      },
      {
        userId: 3,
        groupId: 1,
        status: 'pending'
      },
      {
        userId: 3,
        groupId: 3,
        status: 'member'
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
    options.tableName = 'Memberships';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2, 3, 4, 5, 6] }
    }, {});
  }
};
