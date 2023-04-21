const express = require('express');
const sequelize = require('sequelize');

const { Group, Membership, Venue } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


const router = express.Router();

const validateVenue = [
    check('address')
      .exists({ checkFalsy: true })
      .withMessage("Street address is required"),
    check('city')
      .exists({ checkFalsy: true })
      .withMessage("City is required"),
    check('state')
      .exists({ checkFalsy: true })
      .withMessage("State is required"),
    check('lat')
      .exists({ checkFalsy: true })
      .isFloat({gt:-89, lt:91})
      .withMessage("Latitude is not valid"),
    check('lng')
      .exists({ checkFalsy: true })
      .isFloat({gt:-179, lt:181})
      .withMessage("Longitude is not valid"),
    handleValidationErrors
];

router.put('/:venueId', requireAuth, validateVenue,
    async (req, res, next) => {
        let venue = await Venue.findByPk(req.params.venueId);
        if (!venue) {
            const err = new Error("Venue couldn't be found");
                err.status = 404;
                return next(err);
        }
        const err = new Error('Forbidden');
        err.status = 403;
        let group = await Group.findByPk(venue.groupId);
        let membership = await Membership.findOne({
            where: {
            groupId: group.id,
            userId: req.user.id
            }
        });
        if (!membership || (req.user.id != group.organizerId && membership.status != 'co-host')) {
            return next(err);
        }
        const {address, city, state, lat, lng } = req.body;
        venue.set({
            address,
            city,
            state,
            lat,
            lng
        });
        venue = await venue.save();

        const safeVenue = {
            id: venue.id,
            groupId: venue.groupId,
            address: venue.address,
            city: venue.city,
            state: venue.state,
            lat: venue.lat,
            lng: venue.lng
        };

        res.status(200).json(safeVenue);
})



module.exports = router;
