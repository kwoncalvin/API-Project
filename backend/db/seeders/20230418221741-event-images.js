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
    options.tableName = 'EventImages';
    return queryInterface.bulkInsert(options, [
      {
        eventId: 1,
        url: 'evimg1.com',
        preview: true
      },
      {
        eventId: 1,
        url: 'evimg2.com',
        preview: false
      },
      {
        eventId: 2,
        url: 'evimg3.com',
        preview: false
      },
      {
        eventId: 2,
        url: 'evimg4.com',
        preview: false
      },
      {
        eventId: 3,
        url: 'evimg5.com',
        preview: false
      },
      {
        eventId: 3,
        url: 'evimg6.com',
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
    options.tableName = 'EventImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: { [Op.in]: ['evimg1.com', 'evimg2.com', 'evimg3.com', 'evimg4.com', 'evimg5.com', 'evimg6.com'] }
    }, {});
  }
};
