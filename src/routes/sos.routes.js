import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { triggerSOS, resolveSOS } from '../controllers/sos.controller.js';

const router = Router();
router.use(verifyJWT);

router.route("/trigger").post(triggerSOS);
router.route("/:sosId/resolve").patch(resolveSOS);

export default router; 