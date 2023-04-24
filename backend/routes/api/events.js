const express = require('express');
const sequelize = require('sequelize');
const { Op } = require('sequelize');

const { EventImage, Event, Attendance, Group, Venue } = require('../../db/models');
const { requireAuth, isAttendee, eventExists, isOrgOrCoEv } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateEvent = [
    check('venueId')
      .exists({ checkFalsy: true })
      .custom(async (venueId) => {
        let venue = await Venue.findByPk(venueId);
        if (!venue) {
            let err = new Error("Venue does not exist");
            err.status = 400;
            throw err;
        }
        return true;
    })
      .withMessage("Venue does not exist"),
    check('name')
      .exists({ checkFalsy: true })
      .isLength({ min: 5 })
      .withMessage("Name must be at least 5 characters"),
    check('type')
      .isIn(['Online', 'In person'])
      .withMessage("Type must be 'Online' or 'In person'"),
    check('capacity')
      .exists({ checkFalsy: true })
      .isInt()
      .withMessage("Capacity must be an integer"),
    check('price')
      .exists({ checkFalsy: true })
      .isFloat({min: 0})
      .withMessage("Price is invalid"),
    check('description')
      .exists({ checkFalsy: true })
      .withMessage("Description is required"),
    check('description')
      .exists({ checkFalsy: true })
      .withMessage("Description is required"),
    check('startDate')
      .exists({ checkFalsy: true })
      .custom((date) => {
            let startDate = new Date(date);
            if (startDate == "Invalid Date" || new Date() > startDate) {
                return false
            }
            return true
        })
      .withMessage("Start date must be in the future"),
    check('endDate')
      .exists({ checkFalsy: true })
      .custom((date, { req }) => {
        let startDate = new Date(req.body.startDate);
        let endDate = new Date(date);
        if (endDate == "Invalid Date" || endDate < startDate) {
            return false
        }
        return true;
        })
      .withMessage("End date is less than start date"),
    handleValidationErrors
];

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
        group: ['Event.id', 'EventImages.url', 'Group.id', 'Venue.id'],
        order: ['id']
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

router.put('/:eventId', requireAuth, eventExists, isOrgOrCoEv, validateEvent,
    async (req, res, next) => {
        let event = await Event.findByPk(req.params.eventId);

        let venue = await Venue.findByPk(event.venueId);
        if (!venue) {
            const err = new Error("Venue couldn't be found");
                err.status = 404;
                return next(err);
        }

        const {venueId, name, type, capacity, price, description, startDate, endDate} = req.body;
        event.set({
            venueId,
            name,
            type,
            capacity,
            price,
            description,
            startDate,
            endDate
        });
        event = await event.save();

        const safeEvent = {
            id: event.id,
            groupId: event.groupId,
            venueId: event.venueId,
            name: event.name,
            type: event.type,
            capacity: event.capacity,
            price: event.price,
            description: event.description,
            startDate: event.startDate,
            endDate: event.endDate
        };
        res.status(200).json(safeEvent);
})

router.delete('/:eventId', requireAuth, eventExists, isOrgOrCoEv,
    async (req, res, next) => {
        let event = await Event.findByPk(req.params.eventId);
        await event.destroy();
        res.status(200).json({"message": "Successfully deleted"})
})

module.exports = router;
