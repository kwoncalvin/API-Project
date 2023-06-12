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
        url: 'https://deviniti.com/app/uploads/2021/10/09-20_DM-8186_EVENTS_01_MAIN-2-1024x682.png',
        preview: false
      },
      {
        eventId: 1,
        url: 'https://grantsforus.io/wp-content/uploads/2022/04/1_ydhn1QPAKsrbt6UWfn3YnA.jpeg',
        preview: true
      },
      {
        eventId: 2,
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/The_Event_2010_Intertitle.svg/1200px-The_Event_2010_Intertitle.svg.png',
        preview: true
      },
      {
        eventId: 2,
        url: 'https://spokespersonsdigest.com/wp-content/uploads/sites/33/2020/09/events.jpg',
        preview: false
      },
      {
        eventId: 3,
        url: 'https://gulfbusiness.com/wp-content/uploads/2020/10/Screen-Shot-2020-10-07-at-4.46.27-PM-e1602074875479.png',
        preview: true
      },
      {
        eventId: 3,
        url: 'https://hilltopgardens.com.mt/wp-content/uploads/sites/2/2023/01/180401_Hilltop-Gardens-new-scaled.jpg',
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
