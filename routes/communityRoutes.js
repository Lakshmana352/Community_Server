const express = require('express');
const { createCommunity, getAll, getAllMembers, getMeOwner, getMeJoined } = require('../controllers/communityController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.post('/',authenticateToken,createCommunity);
router.get('/',getAll);
router.get('/:id/members',getAllMembers);
router.get('/me/owner',authenticateToken,getMeOwner);
router.get('/me/member',authenticateToken,getMeJoined);

module.exports = router;