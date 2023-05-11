const express = require('express');
const sequelize = require('sequelize');

const { EventImage, Event, Attendance, Group, Venue, Membership, User } = require('../../db/models');
const { requireAuth, eventExists, isOrgOrCoEv } = require('../../utils/auth');
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
    let {page, size, name, type, startDate} = req.query;
    let err = new Error("Bad Request");
    err.status = 400;
    if (page && (page < 1 || page > 10)) {
        err.errors.page = "Page must be greater than or equal to 1";
        return next(err)
    } else if (size && (size < 1 || size > 20)) {
        err.errors.size = "Size must be greater than or equal to 1";
        return next(err)
    } else if (name && typeof name != 'string') {
        err.errors.name = "Name must be a string";
        return next(err)
    } else if (type && (type != 'Online' && type != 'In person')) {
        err.errors.type = "Type must be 'Online' or 'In person'";
        return next(err)
    } else if (startDate && new Date(startDate) === 'Invalid Date') {
        err.errors.startDate = "Start date must be a valid datetime";
        return next(err)
    }
    let limit = size? size : 20;
    let offset = page? (page - 1) * size : 0;
    let where = {};
    if (name) where.name = name;
    if (type) where.type = type;
    if (startDate) where.startDate = startDate;
    let events = await Event.findAll({
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
    let events1 = [];
    for (let event of events) {
        event = event.toJSON();
        if ((!name || event.name == name) && (!type || event.type == type) && (!startDate || event.startDate == startDate)) {
            events1.push(event)
        }
    }
    events = events1.splice(offset, limit)
    res.status(200).json({Events: events});
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

router.post('/:eventId/images', requireAuth, eventExists,
    async (req, res, next) => {
        const {url, preview} = req.body;
        let event = await Event.findByPk(req.params.eventId);
        let group = await Group.findByPk(event.groupId);
        const attendee = await Attendance.findOne({
            where: {
              userId: req.user.id,
              eventId: req.params.eventId,
              status: 'attending'
            }
          })
          if (!attendee && req.user.id != group.organizerId) {
            const err = new Error('Forbidden');
            err.status = 403;
            return next(err);
          }
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

router.get('/:eventId/attendees', eventExists,
    async (req, res, next) => {
        let event = await Event.findByPk(req.params.eventId);
        let group = await Group.findByPk(event.groupId);
        let membership = await Membership.findOne({
            where: {
            groupId: group.id,
            userId: req.user.id
            }
        });
        let where = {eventId: req.params.eventId};
        if (req.user.id != group.organizerId && (!membership || membership.status != 'co-host')) {
            where.status = ['waitlist', 'attending']
        }
        let attendees = await User.findAll({
            include: {
                model: Attendance, as: 'Attendance',
                attributes: ['status'],
                where
            },
            attributes: ['id', 'firstName', 'lastName']
        })

        res.status(200).json({'Attendees': attendees});
})

router.post('/:eventId/attendance', requireAuth, eventExists,
    async (req, res, next) => {
        let event = await Event.findByPk(req.params.eventId);
        let group = await Group.findByPk(event.groupId);
        let membership = await Membership.findOne({
            where: {
            groupId: group.id,
            userId: req.user.id
            }
        });
        if (!membership) {
            const err = new Error('Forbidden');
            err.status = 403;
            return next(err);
        }
        let attendance = await Attendance.findOne({
            where: {
            eventId: event.id,
            userId: req.user.id
            }
        });
        if (attendance) {
            const err = attendance.status == 'pending' ?
                new Error("Attendance has already been requested") : new Error("User is already an attendee of the event");
            err.status = 400;
            return next(err);
        }
        attendance = await Attendance.create({
            eventId: req.params.eventId,
            userId: req.user.id,
            status: 'pending'
        });
        const safeAttendance = {
            userId: attendance.userId,
            status: attendance.status
        }

        res.status(200).json(safeAttendance);
})

router.put('/:eventId/attendance', requireAuth, eventExists,
    async (req, res, next) => {
        let event = await Event.findByPk(req.params.eventId);
        let group = await Group.findByPk(event.groupId);
        let membership = await Membership.findOne({
            where: {
            groupId: group.id,
            userId: req.user.id
            }
        });
        if (req.user.id != group.organizerId && (!membership || membership.status != 'co-host')) {
            const err = new Error('Forbidden');
            err.status = 403;
            return next(err);
        }
        let {userId, status} = req.body;
        if (status == 'pending') {
            const err = new Error("Cannot change an attendance status to pending");
            err.status = 400;
            return next(err);
        }
        let attendance = await Attendance.findOne({
            where: {
            eventId: req.params.eventId,
            userId: userId
            }
        });
        if (!attendance) {
            const err = new Error("Attendance between the user and the event does not exist");
            err.status = 404;
            return next(err);
        }
        attendance.set({ status });
        attendance = await attendance.save();

        const safeAttendance = {
            id: attendance.id,
            eventId: attendance.eventId,
            userId: attendance.userId,
            status: attendance.status
        }
        return res.status(200).json(safeAttendance);
})

router.delete('/:eventId/attendance', requireAuth, eventExists,
    async (req, res, next) => {

        let {userId} = req.body;
        let event = await Event.findByPk(req.params.eventId);
        let group = await Group.findByPk(event.groupId);
        let err = new Error("Only the User or organizer may delete an Attendance");
        err.status = 403;
        if (group.organizerId != req.user.id && userId != req.user.id) {
            return next(err)
        }

        let attendance = await Attendance.findOne({
            where: {
            eventId: req.params.eventId,
            userId: userId
            }
        });
        if (!attendance) {
            const err = new Error("Attendance does not exist for this User");
            err.status = 404;
            return next(err);
        }
        await attendance.destroy();
        res.status(200).json({"message": "Successfully deleted attendance from event"})
})

module.exports = router;
