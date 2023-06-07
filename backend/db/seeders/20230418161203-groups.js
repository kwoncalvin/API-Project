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
    options.tableName = 'Groups';
    return queryInterface.bulkInsert(options, [
      {
        organizerId: 1,
        name: 'Swimming',
        about: 'For if you like swimming',
        type: 'In person',
        private: false,
        city: 'Torrance',
        state: 'CA'
      },
      {
        organizerId: 2,
        name: 'Video Games',
        about: 'If you like games of any kind',
        type: 'Online',
        private: true,
        city: 'New York City',
        state: 'NY'
      },
      {
        organizerId: 3,
        name: 'Tennis',
        about: 'Enjoy rounds of tennis',
        type: 'Online',
        private: true,
        city: 'Los Angeles',
        state: 'CA'
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Groups';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['Swimming', 'Video Games', 'Tennis'] }
    }, {});
  }
};
