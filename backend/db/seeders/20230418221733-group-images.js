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
        url: 'https://cdn.britannica.com/66/162466-131-47ADB66F/Man-butterfly-stroke-pool.jpg',
        preview: true
      },
      {
        groupId: 1,
        url: 'gpimg2.com',
        preview: false
      },
      {
        groupId: 2,
        url: 'https://media.wired.com/photos/62feb60bcea7c0581e825cb0/master/w_2560%2Cc_limit/Fate-of-Game-Preservation-Games-GettyImages-1170073827.jpg',
        preview: true
      },
      {
        groupId: 2,
        url: 'gpimg4.com',
        preview: false
      },
      {
        groupId: 3,
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Tennis_Racket_and_Balls.jpg/1280px-Tennis_Racket_and_Balls.jpg',
        preview: true
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
      groupId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
