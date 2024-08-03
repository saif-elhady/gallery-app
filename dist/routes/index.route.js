"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const photo_model_1 = require("../models/photo.model");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const router = (0, express_1.Router)();
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path_1.default.join(__dirname, '../assets/images'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path_1.default.extname(file.originalname));
    }
});
const upload = (0, multer_1.default)({ storage: storage });
router.get('/', async (req, res, next) => {
    try {
        const photos = await photo_model_1.Photo.find();
        res.render('index', { photos });
    }
    catch (err) {
        console.error(err);
        next(err);
    }
});
router.post('/', upload.single('file'), async (req, res, next) => {
    try {
        console.log(req.file);
        const newPhoto = new photo_model_1.Photo({
            path: req.file?.filename,
            title: req.body.title
        });
        await newPhoto.save();
        res.redirect('/');
    }
    catch (err) {
        console.error(err);
        next(err);
    }
});
exports.default = router;
