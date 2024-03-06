const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const searchController = require('../controllers/searchController');
const batchController = require('../controllers/batchController')
const verifyToken = require('../middleware/authMiddleware');
const multer = require('multer');
const upload = multer({dest: 'Images/' });

// Route to save a new student
router.post('/saveStudent', studentController.saveStudent);

router.post('/verifyByEmailAndPassword', studentController.verifyByEmailAndPassword);

router.post('/verifyByPhoneAndPassword', studentController.verifyByPhoneAndPassword);


// Get student details based on authenticated user's token
router.get('/getStudentDetails', verifyToken, studentController.getStudentDetails);

// Update student details based on authenticated user's token
router.put('/updateRole', verifyToken, studentController.updateRole);

// Save or update profile details based on authenticated user's token
router.post('/saveOrUpdateProfile', verifyToken, studentController.saveOrUpdateProfile);

// Get profile details based on authenticated user's token
router.get('/getProfileDetails', verifyToken, studentController.getProfileDetails);

router.post('/uploadProfileImage', verifyToken, upload.single('image'), studentController.uploadProfileImage);

router.get('/profile/image', verifyToken, studentController.getProfileImage);

// Get all student details
router.get('/getAllStudentDetails', verifyToken, studentController.getAllStudentDetails);

router.get('/getAllStudentProfileDetails', verifyToken, studentController.getAllStudentProfileDetails);

router.put('/updatePassword', verifyToken, studentController.updatePassword);

router.get('/searchByEmail', verifyToken, searchController.searchByEmail);

router.get('/searchByName', verifyToken, searchController.searchByName);

router.get('/searchByPhoneNumber', verifyToken, searchController.searchByPhoneNumber);

router.get('/profilePhoneNumber', verifyToken, searchController.profilePhoneNumberr);

router.post('/sendPasswordResetEmail', studentController.sendPasswordResetEmail);

router.post('/resetPassword', studentController.resetPassword);

router.post('/saveBatch',verifyToken, batchController.saveBatch)

router.post('/assignBatchesToStudent',verifyToken,batchController.assignBatchesToStudent)

router.get('/getStudentBatches',verifyToken,batchController.getStudentBatches)

router.get('/getAllStudentsWithBatches',verifyToken,batchController.getAllStudentsWithBatches)

router.get('/getAllBatches',verifyToken,batchController.getAllBatches)

router.post('/deassignBatchesFromStudent',verifyToken,batchController.deassignBatchesFromStudent)

router.post('/getStudentsByBatches',verifyToken,batchController.getStudentsByBatches)

router.delete('/deleteBatch',verifyToken,batchController.deleteBatch)

router.put('/updateBatch',verifyToken,batchController.updateBatch)


module.exports = router;
