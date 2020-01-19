const express = require('express');
const router = express.Router();
const controller = require('./asset.controller');
const middleware = require('./asset.middleware');


const controllerVariation = require('../variation/variation.controller');
const middlewareVariation = require('../variation/variation.middleware');



//Rotas de assets

router.get('/', controller.getAssets);

router.get('/:id', controller.getAsset);

router.post('/', [middleware.validateAsset], controller.createAsset);

router.put('/:id', [middleware.validateAsset], controller.updateAsset);

router.delete('/:id', controller.deleteAsset);

//Rotas de variations

router.get('/:id/variations', controllerVariation.getVariations);

router.get('/:id/variations/:idVariation', controllerVariation.getVariation);

router.post('/:id/variations/', [middlewareVariation.validateVariation], controllerVariation.createVariation);

router.put('/:id/variations/:idVariation', [middlewareVariation.validateVariation], controllerVariation.updateVariation);

router.delete('/:id/variations/:idVariation', controllerVariation.deleteVariation);


module.exports = router; 
