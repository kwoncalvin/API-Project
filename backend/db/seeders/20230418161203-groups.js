'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
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
        name: 'Group1',
        about: 'about group 1',
        type: 'Online',
        private: 'false',
        city: 'City1',
        state: 'State1'
      },
      {
        name: 'Group2',
        about: 'about group 2',
        type: 'In Person',
        private: 'true',
        city: 'City2',
        state: 'State2'
      },
      {
        name: 'Group3',
        about: 'about group 3',
        type: 'Online',
        private: 'true',
        city: 'City3',
        state: 'State3'
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Groups';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['Group1', 'Group2', 'Group3'] }
    }, {});
  }
};
