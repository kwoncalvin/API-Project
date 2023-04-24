const express = require('express');

const { GroupImage, Group, Membership } = require('../../db/models');
const { requireAuth} = require('../../utils/auth');

const router = express.Router();

router.delete('/:imageId', requireAuth,
    async (req, res, next) => {
        let groupImage = await GroupImage.findByPk(req.params.imageId);
        if (!groupImage) {
            const err = new Error("Group Image couldn't be found");
            err.status = 404;
            return next(err);
        }
        let group = await Group.findByPk(groupImage.groupId);

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
        await groupImage.destroy();
        res.status(200).json({"message": "Successfully deleted"})
})

module.exports = router;
