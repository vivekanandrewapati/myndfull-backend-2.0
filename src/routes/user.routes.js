// import { Router } from 'express';
// import {
//     getUserProfile,
//     updateUserProfile,
// } from '../controllers/user.controller.js';
// import { upload } from '../middlewares/multer.middleware.js';
// import { verifyJWT } from '../middlewares/auth.middleware.js';

// const router = Router();

// router.use(verifyJWT); // Protect all routes

// router.route("/profile")
//     .get(getUserProfile)
//     .patch(
//         upload.single("avatar"),
//         updateUserProfile
//     );

// export default router;


// import { Router } from "express";
// import { verifyJWT } from "../middlewares/auth.middleware.js";
// import { registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetails, updateUserAvatar } from "../controllers/user.controller.js";
// import { upload } from "../middlewares/multer.middleware.js"


// const router = Router()

// router.route("/register").post(

//     upload.fields([
//         {
//             name: "avatar",
//             maxCount: 1
//         }
//     ]),
//     registerUser

// )
// router.route("/login").post(loginUser)

// router.route("/logout").post(verifyJWT, logoutUser)

// router.route("/refresh-token").post(refreshAccessToken)
// router.route("/change-password").post(verifyJWT, changeCurrentPassword)
// router.route("/current-user").get(verifyJWT, getCurrentUser)
// router.route("/update-account").patch(verifyJWT, updateAccountDetails)

// router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)
// export default router

import { Router } from "express";
import {
    registerUser,
    loginUser,
    getCurrentUser,
    updateUserProfile,
    logoutUser,
    refreshAccessToken,
    checkAuth
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { ApiResponse } from "../utils/ApiResponse.js"; 

const router = Router()

router.route("/register").post(

    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }
    ]),
    registerUser

)
router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/update-account").patch(verifyJWT, updateUserProfile)
router.route("/check-auth").get(verifyJWT, (req, res) => {
    res.status(200).json(
        new ApiResponse(
            200,
            { authenticated: true, user: req.user },
            "Authentication successful"
        )
    );
});

export default router


