import express from 'express';
// import { addShow, getNowPlayingMovies, getShow, getShows } from '../controllers/showController.js';
import { getNowPlayingMovies,addShow } from '../controllers/showController.js';

// import { protectAdmin } from '../middleware/auth.js';

const ShowRouter = express.Router();

// ShowRouter.get('/now-playing',protectAdmin, getNowPlayingMovies);
ShowRouter.get('/now-playing', getNowPlayingMovies);

// ShowRouter.post('/add',protectAdmin ,addShow);
ShowRouter.post('/add',addShow);


// ShowRouter.get('/all',getShows)
// ShowRouter.get('/:movieId',getShow)

export default ShowRouter;