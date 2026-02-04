const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/', applicationController.createApplication);
router.get('/', applicationController.getApplications);
router.get('/:id', applicationController.getApplication);
router.put('/:id', applicationController.updateApplication);
router.delete('/:id', applicationController.deleteApplication);

module.exports = router;
