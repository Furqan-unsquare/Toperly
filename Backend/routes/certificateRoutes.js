// routes/certificateRoutes.js
import express from 'express';
import {
  createCertificate,
  getAllCertificates,
  getCertificateById,
  updateCertificate,
  deleteCertificate,
  getStudentCertificates,
  issueCertificateIfEligible
} from '../controllers/certificateController.js';

const router = express.Router();

// Certificate routes
router.post('/', createCertificate);
router.get('/', getAllCertificates);
router.get('/:id', getCertificateById);
router.put('/:id', updateCertificate);
router.delete('/:id', deleteCertificate);
router.get('/student/:studentId', getStudentCertificates);
// Issue if eligible
router.post('/issue/:courseId/:studentId', issueCertificateIfEligible);


export default router;
