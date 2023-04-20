const express = require('express');
const sequelize = require('sequelize');

const { Group, Membership, GroupImage } = require('../../db/models');


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

router.get('/groups/current', async (req, res, next) => {
    const groups = await Group.findAll({
        include: [{
            model: Membership,
            attributes: [],
            where: {userId: req.user.id}
        }]
    })
})

module.exports = router;
