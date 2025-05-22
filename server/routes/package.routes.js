 import express from 'express';
 import { PackageController } from '../controllers/package.js';
 import Authorized from '../middleware/authMiddleware.js';
 import FileUploader from '../middleware/multerMiddleware.js';
 const uploadSingleImage = new FileUploader();
 const router = express.Router();

 // Add package
 router.post('/package/add', Authorized.auth, uploadSingleImage.uploadSingle, PackageController.addPackage);

 // Get all packages
 router.get('/package/get', PackageController.getPackage);

 // Get specific package by type
 router.post('/package/type/:id', PackageController.getSpecificPackage);

 // Update package
 router.patch('/package/update/:id', Authorized.auth, uploadSingleImage.uploadSingle, PackageController.updatePackage);
 // get Owner Package
 router.get('/package/owner', Authorized.auth, PackageController.getOwnerPackage);
 // get Owner delete
 router.delete('/package/delete/owner/:id', Authorized.auth, PackageController.deleteOwnerPackage);

 export default router;