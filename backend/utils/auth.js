const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config');
const { User, Group, Membership, Event, Attendance } = require('../db/models');

const { secret, expiresIn } = jwtConfig;

// Sends a JWT Cookie
const setTokenCookie = (res, user) => {
    // Create the token.
    const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username,
    };
    const token = jwt.sign(
        { data: safeUser },
        secret,
        { expiresIn: parseInt(expiresIn) } // 604,800 seconds = 1 week
    );

    const isProduction = process.env.NODE_ENV === "production";

    // Set the token cookie
    res.cookie('token', token, {
        maxAge: expiresIn * 1000, // maxAge in milliseconds
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction && "Lax"
    });

    return token;
};

const restoreUser = (req, res, next) => {
    // token parsed from cookies
    const { token } = req.cookies;
    req.user = null;

    return jwt.verify(token, secret, null, async (err, jwtPayload) => {
      if (err) {
        return next();
      }

      try {
        const { id } = jwtPayload.data;
        req.user = await User.findByPk(id, {
          attributes: {
            include: ['email', 'createdAt', 'updatedAt']
          }
        });
      } catch (e) {
        res.clearCookie('token');
        return next();
      }

      if (!req.user) res.clearCookie('token');

      return next();
    });
};

// If there is no current user, return an error
const requireAuth = function (req, _res, next) {
    if (req.user) return next();

    const err = new Error('Authentication required');
    err.title = 'Authentication required';
    // err.errors = { message: 'Authentication required' };
    err.status = 401;
    return next(err);
};

const isOrganizer = async (req, _res, next) => {
  let group = await Group.findByPk(req.params.groupId);
  if (req.user.id == group.organizerId) return next();

  const err = new Error('Forbidden');
    err.title = 'Authorization required';
    // err.errors = { message: 'Forbidden' };
    err.status = 403;
    return next(err);
};

const groupExists = async (req, _res, next) => {
  let group = await Group.findByPk(req.params.groupId);
  if (group) return next();

  const err = new Error("Group couldn't be found");
    err.title = "Group couldn't be found";
    err.errors = undefined;
    err.status = 404;
    return next(err);
};

const eventExists = async (req, _res, next) => {
  let event = await Event.findByPk(req.params.eventId);
  if (event) return next();

  const err = new Error("Event couldn't be found");
    err.title = "Event couldn't be found";
    err.errors = undefined;
    err.status = 404;
    return next(err);
};

const isOrgOrCo = async (req, _res, next) => {
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
  if (!membership) return next(err);
  if (req.user.id == group.organizerId || membership.status == 'co-host') return next();
  return next(err);
};

const isAttendee = async (req, _res, next) => {
  const attendee = await Attendance.findOne({
    where: {
      userId: req.user.id,
      eventId: req.params.eventId,
      status: 'attending'
    }
  })
  if (!attendee) {
    const err = new Error('Forbidden');
    err.status = 403;
    return next(err);
  }
  return next();
}

module.exports = {
        setTokenCookie,
        restoreUser,
        requireAuth,
        isOrganizer,
        groupExists,
        eventExists,
        isOrgOrCo,
        isAttendee };
