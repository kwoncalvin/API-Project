const express = require('express');
const sequelize = require('sequelize');
const { Op } = require('sequelize');

const { EventImage, Event, Attendance, Group, Venue } = require('../../db/models');
const { requireAuth, isOrganizer, groupExists, isOrgOrCo } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

router.get('/', async (req, res, next) => {
    const events = await Event.findAll({
        include: [
        {
            model: Attendance,
            where: {status: 'attending'},
            attributes: [],
            required: false
        },
        {
            model: EventImage,
            attributes: [],
            where: {preview: true},
            required: false
        },
        {
            model: Group,
            attributes: ['id', 'name', 'city', 'state']
        },
        {
            model: Venue,
            attributes: ['id', 'city', 'state']
        },
        ],
        attributes: {
            include: [[sequelize.fn("COUNT", sequelize.col('Attendances.id')), "numAttending"],
                [sequelize.col('EventImages.url'), 'previewImage']]
        },
        group: ['Event.id', 'EventImages.url', 'Group.id']
    });
    res.status(200).json(events);
})

module.exports = router;
