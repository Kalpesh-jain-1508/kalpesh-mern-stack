import express from "express"
import { adminLogin, adminRegister, customerRegister, myProfile, userLogin, userLogout, verifyEmail } from "../../Controllers/User/userController.js";
import { isAuthenticatedUser } from './../../Middlewares/auth.js';

const router = express.Router();

router.route('/register/customer').post(customerRegister);
router.route('/register/admin').post(adminRegister);
router.route("/verify/:token").get(verifyEmail);
router.route('/login/admin').post(adminLogin);
router.route('/login/customer').post(userLogin);
router.route("/logout").get(userLogout);
router.route("/me").get(isAuthenticatedUser, myProfile);

export default router;