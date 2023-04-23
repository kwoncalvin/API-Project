const express = require('express');
const sequelize = require('sequelize');
const { Op } = require('sequelize');

const { EventImage, Event, Attendance, Group, Venue } = require('../../db/models');
const { requireAuth, isAttendee, eventExists, isOrgOrCo } = require('../../utils/auth');
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
                [sequelize.col('EventImages.url'), 'previewImage']],
            exclude: ['description', 'capacity', 'price', 'createdAt', 'updatedAt']
        },
        group: ['Event.id', 'EventImages.url', 'Group.id', 'Venue.id']
    });
    res.status(200).json(events);
})

router.get('/:eventId', async (req, res, next) => {
    const event = await Event.findByPk(req.params.eventId, {
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
                [sequelize.col('EventImages.url'), 'previewImage']],
            exclude: ['description', 'capacity', 'price', 'createdAt', 'updatedAt']
        },
        group: ['Event.id', 'EventImages.url', 'Group.id', 'Venue.id']
    });

    if (!event) {
        const err = new Error("Event couldn't be found");
            err.status = 404;
            return next(err);
    }
    res.status(200).json(event);
})

router.post('/:eventId/images', requireAuth, eventExists, isAttendee,
    async (req, res, next) => {
        const {url, preview} = req.body;
        const eventImage = await EventImage.create({
            eventId: req.params.eventId,
            url,
            preview
        });

        const safeImg = {
            id: eventImage.id,
            url: eventImage.url,
            preview: eventImage.preview
        };

        return res.json(safeImg);
})

module.exports = router;
