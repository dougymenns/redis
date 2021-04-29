//package imports
const { Router } = require('express')
const router = Router()

//local imports
const movieController = require('../controller/index')

router.get('/all' , movieController.getMovies)


module.exports = router
