const express = require('express');
const sequelize = require('sequelize');
const { Op } = require('sequelize');

const { Group, Membership, GroupImage, User, Venue, Event, Attendance, EventImage } = require('../../db/models');
const { requireAuth, isOrganizer, groupExists, isOrgOrCo } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


const router = express.Router();

const validateGroup = [
    check('name')
      .exists({ checkFalsy: true })
      .isLength({ max: 60 })
      .withMessage('Name must be 60 characters or less'),
    check('about')
      .exists({ checkFalsy: true })
      .isLength({ min: 50 })
      .withMessage('About must be 50 characters or more'),
    check('type')
      .isIn(['Online', 'In person'])
      .withMessage("Type must be 'Online' or 'In person'"),
    check('private')
      .exists({ checkFalsy: false })
      .isBoolean()
      .withMessage("Private must be a boolean"),
    check('city')
      .exists({ checkFalsy: true })
      .withMessage("City is required"),
    check('state')
      .exists({ checkFalsy: true })
      .withMessage("State is required"),
    handleValidationErrors
];

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
    const groups = await Group.findAll({
        include: [
        {
            model: Membership,
            attributes: []
        },
        {
            model: GroupImage,
            attributes: [],
            where: {preview: true},
            required: false
        }],
        attributes: {
            include: [[sequelize.fn("COUNT", sequelize.col('Memberships.id')), "numMembers"],
                [sequelize.col('GroupImages.url'), 'previewImage']]
        },
        group: ['Group.id', 'GroupImages.url']
    });
    res.status(200).json(groups);
})

router.get('/current', requireAuth, async (req, res, next) => {
    const groups1 = await Group.findAll({
        include: [
        {
            model: Membership,
            attributes: []
        },
        {
            model: GroupImage,
            attributes: [],
            where: {preview: true},
            required: false
        }],
        where: {
            [Op.or]: [
                {organizerId: req.user.id},
                {'$Memberships.userId$': req.user.id}
            ]
        },
        attributes: {
            include: [[sequelize.fn("COUNT", sequelize.col('Memberships.id')), "numMembers"],
                [sequelize.col('GroupImages.url'), 'previewImage']]
        },
        group: ['Group.id', 'GroupImages.url'],
        order: ['id']
    });
    let groups = [];
    for (let group of groups1) {
        group = group.toJSON();
        let numMembers = await Membership.count({
            where: {groupId: group.id}
        })
        group.numMembers = numMembers
        groups.push(group);
    }
    res.status(200).json(groups);
})

router.get('/:groupId', groupExists, async (req, res, next) => {
    const group = await Group.findByPk(req.params.groupId, {
        attributes: {
            include: [[sequelize.fn("COUNT", sequelize.col('Memberships.id')), "numMembers"]]
        },
        include: [
        {
            model: Membership,
            attributes: []
        },
        {
            model: GroupImage,
            attributes: ['id', 'url', 'preview']
        },
        {
            model: User, as: "Organizer",
            attributes: ['id', 'firstName', 'lastName']
        },
        {
            model: Venue,
            attributes: {exclude: ['createdAt', 'updatedAt']}
        }],
        group:['Group.id', 'GroupImages.id', 'Venues.id', 'Organizer.id']
    })
    if (!group) {
        const err = new Error("Group couldn't be found");
        err.title = "Group couldn't be found";
        err.errors = { message: "Group couldn't be found" };
        err.status = 404;
        return next(err);
    }
    res.status(200).json(group);
})

router.post('/', requireAuth, validateGroup,
    async (req, res, next) => {
        const {name, about, type, private, city, state } = req.body;
        const group = await Group.create({
            organizerId: req.user.id,
            name,
            about,
            type,
            private,
            city,
            state
        });
        res.status(200).json(group)

})

router.post('/:groupId/images', requireAuth, groupExists, isOrganizer,
    async (req, res, next) => {
        const {url, preview} = req.body;
        const groupImage = await GroupImage.create({
            groupId: req.params.groupId,
            url,
            preview
        });

        const safeImg = {
            id: groupImage.id,
            url: groupImage.url,
            preview: groupImage.preview
        };

        return res.json(safeImg);
})

router.put('/:groupId', requireAuth, groupExists, isOrganizer, validateGroup,
    async (req, res, next) => {
        const {name, about, type, private, city, state } = req.body;
        let group = await Group.findByPk(req.params.groupId);
        group.set({
            name,
            about,
            type,
            private,
            city,
            state
        });
        group = await group.save();
        res.status(200).json(group);
})

router.delete('/:groupId', requireAuth, groupExists, isOrganizer,
    async (req, res, next) => {
        let group = await Group.findByPk(req.params.groupId);
        await group.destroy();
        res.status(200).json({"message": "Successfully deleted"})
})

router.get('/:groupId/venues', requireAuth, groupExists, isOrgOrCo,
    async (req, res, next) => {
        let venues = await Group.findByPk(req.params.groupId, {
            include: {
                model: Venue,
                attributes: {exclude: ['createdAt', 'updatedAt']}
            },
            attributes: []
        });
        res.status(200).json(venues);
})

router.post('/:groupId/venues', requireAuth, groupExists, isOrgOrCo, validateVenue,
    async (req, res, next) => {
        const {address, city, state, lat, lng} = req.body;
        const venue = await Venue.create({
            groupId: req.params.groupId,
            address,
            city,
            state,
            lat,
            lng
        });

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

router.get('/:groupId/events', requireAuth, groupExists,
    async (req, res, next) => {
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
            where: {groupId: req.params.groupId},
            attributes: {
                include: [[sequelize.fn("COUNT", sequelize.col('Attendances.id')), "numAttending"],
                    [sequelize.col('EventImages.url'), 'previewImage']],
                exclude: ['description', 'capacity', 'price', 'createdAt', 'updatedAt']
            },
            group: ['Event.id', 'EventImages.url', 'Group.id', 'Venue.id']
        });
        res.status(200).json(events);
})

router.post('/:groupId/events', requireAuth, groupExists, isOrgOrCo, validateEvent,
    async (req, res, next) => {
        const {venueId, name, type, capacity, price, description, startDate, endDate} = req.body;
        const event = await Event.create({
            groupId: req.params.groupId,
            venueId,
            name,
            type,
            capacity,
            price,
            description,
            startDate,
            endDate
        });

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

router.get('/:groupId/members', groupExists,
    async (req, res, next) => {
        let group = await Group.findByPk(req.params.groupId);
        let membership = await Membership.findOne({
            where: {
            groupId: group.id,
            userId: req.user.id
            }
        });
        let where = {groupId: req.params.groupId};
        if (req.user.id != group.organizerId && (!membership || membership.status != 'co-host')) {
            where.status = ['co-host', 'member']
        }
        members = await User.findAll({
            include: {
                model: Membership, as: 'Membership',
                attributes: ['status'],
                where
            },
            attributes: ['id', 'firstName', 'lastName']
        })

        res.status(200).json({'Members': members});
})

router.post('/:groupId/membership', requireAuth, groupExists,
    async (req, res, next) => {
        let membership = await Membership.findOne({
            where: {
            groupId: req.params.groupId,
            userId: req.user.id
            }
        });
        if (membership) {
            const err = membership.status == 'pending' ?
                new Error("Membership has already been requested") : new Error("User is already a member of the group");
            err.status = 400;
            return next(err);
        }
        membership = await Membership.create({
            groupId: req.params.groupId,
            userId: req.user.id,
            status: 'pending'
        });
        const safeMembership = {
            memberId: membership.userId,
            status: membership.status
        }

        res.status(200).json(safeMembership);
})

router.put('/:groupId/membership', requireAuth, groupExists,
    async (req, res, next) => {

        let {memberId, status} = req.body;
        if (status == 'co-host') {
            let group = await Group.findByPk(req.params.groupId);
            if (req.user.id != group.organizerId) {
                const err = new Error('Forbidden');
                    err.title = 'Authorization required';
                    // err.errors = { message: 'Forbidden' };
                    err.status = 403;
                    return next(err);
            }
        } else {
            const err = new Error('Forbidden');
                err.title = 'Authorization required';
                // err.errors = { message: 'Forbidden' };
                err.status = 403;
            let group = await Group.findByPk(req.params.groupId);
            let membership = await Membership.findOne({
                where: {
                groupId: group.id,
                userId: req.user.id
                }
            });
            if (req.user.id != group.organizerId && (!membership || membership.status != 'co-host')) return next(err);
        }

        const err = new Error("Validations Error");
        err.status = 400;
        if (status == 'pending') {
            err.errors = {'status': 'Cannot change a membership status to pending'}
            return next(err);
        }
        let user = await User.findByPk(memberId);
        if (!user) {
            err.errors = {'memberId': "User couldn't be found"};
            return next(err);
        }

        let group = await Group.findByPk(req.params.groupId)
        console.log(group)
        let membership = await Membership.findOne({
            where: {
            groupId: req.params.groupId,
            userId: memberId
            }
        });

        if (!membership) {
            err.status = 400
            err.errors = {"message": "Membership between the user and the group does not exist"};
            return next(err);
        }
        membership.set({
            status
        });
        membership = await membership.save();

        const safeMembership = {
            id: membership.id,
            groupId: membership.groupId,
            memberId: membership.userId,
            status: membership.status
        }
        console.log(safeMembership)
        return res.status(200).json(safeMembership);
})

module.exports = router;
