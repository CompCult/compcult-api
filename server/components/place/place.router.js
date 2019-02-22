var express = require('express');
var router = express.Router();

const placeCtrl = require('./place.controller');

router.get('/', placeCtrl.findPlaces);

router.get('/query/fields', placeCtrl.findPlaceByParams);

router.post('/', placeCtrl.createPlace);

router.post('/update/:place_id', placeCtrl.updatePlace);

router.post('/remove/:place_id', placeCtrl.deletePlace);

router.delete('/:place_id', placeCtrl.deletePlace);

module.exports = router;
