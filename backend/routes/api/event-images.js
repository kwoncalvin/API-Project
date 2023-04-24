const express = require('express');
const sequelize = require('sequelize');

const { EventImage, Event, Attendance, Group, Venue, Membership, User } = require('../../db/models');
const { requireAuth, isAttendee, eventExists, isOrgOrCoEv } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

router.delete('/:imageId', requireAuth,
    async (req, res, next) => {
        let eventImage = await EventImage.findByPk(req.params.imageId);
        if (!eventImage) {
            const err = new Error("Event Image couldn't be found");
            err.status = 404;
            return next(err);
        }
        let event = await Event.findByPk(eventImage.eventId)
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
        await eventImage.destroy();
        res.status(200).json({"message": "Successfully deleted"})
})

module.exports = router;
