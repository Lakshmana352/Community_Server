const express = require('express');
const { addMember, removeMember } = require('../controllers/memberController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.post('/',authenticateToken,addMember);
router.delete('/:id',authenticateToken,removeMember);

module.exports = router;