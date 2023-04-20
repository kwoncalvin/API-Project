const express = require('express');
const sequelize = require('sequelize');
const { Op } = require('sequelize');

const { Group, Membership, GroupImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');


const router = express.Router();

router.get('/', async (req, res, next) => {
    const groups = await Group.findAll({
        include: [{
            model: Membership,
            attributes: []
        },
        {
            model: GroupImage,
            attributes: [],
            where: {preview: true},
            required: false
        }
        ],
        attributes: {
            include: [[sequelize.fn("COUNT", sequelize.col('Memberships.id')), "numMembers"],
                [sequelize.col('GroupImages.url'), 'previewImage']]
        },
        group: ['Group.id', 'GroupImages.url']
    });
    res.status(200);
    res.json(groups);
})

router.get('/current', requireAuth, async (req, res, next) => {
    const groups1 = await Group.findAll({
        include: [{
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
        group: ['Group.id', 'GroupImages.url']
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
    res.status(200);
    res.json(groups);
})

module.exports = router;
