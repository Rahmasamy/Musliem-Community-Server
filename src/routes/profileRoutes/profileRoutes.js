import multer from "multer";

import { createProfile, updateProfile, deleteProfile,getMyProfile,getAllProductsForUser,getAllAdvertisementsForUser,logoutUser} from "../../controllers/profileController/profileController";
import protect from "../../middlewares/auth/authMiddleware";

const profileRouter = express.Router();

const storage = multer.diskStorage({
    destination : (req,file,cb) => {
        cb(null,"uploads/")
    },
    filename: (req,res,cb) => {
        cb(null,`${Date.now()}- ${ file.originalname}`)
    }
})

const upload = multer({storage:storage})

profileRouter.post("/", upload.single("photo"), createProfile);
profileRouter.get("/me", protect, getMyProfile);
profileRouter.get("/me/products", protect, getAllProductsForUser);
profileRouter.get("/me/advertisments", protect, getAllAdvertisementsForUser);
profileRouter.put("/:id", upload.single("photo"),protect, updateProfile);
profileRouter.delete("/:id",protect, deleteProfile);
profileRouter.post("/logout", logoutUser);

