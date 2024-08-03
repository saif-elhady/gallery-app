import { Router } from 'express';
import { Photo } from '../models/photo.model';
import multer from 'multer';
import path from 'path';

const router = Router();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../assets/images'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
})

const upload = multer({ storage: storage });

router.get('/', async (req, res, next) => {
    try {
        const photos = await Photo.find();
        res.render('index', { photos });
    } catch (err) {
        console.error(err);
        next(err)
    }
})

router.post(
    '/',
    upload.single('file'),
    async (req, res, next) => {
        try {
            console.log(req.file);
            const newPhoto = new Photo({
                path: req.file?.filename,
                title: req.body.title
            })
            await newPhoto.save();
            res.redirect('/');
        }
        catch (err) {
            console.error(err);
            next(err)
        }
    }
)

export default router;