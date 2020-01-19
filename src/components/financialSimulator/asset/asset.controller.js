const { Asset } = require('./asset.model');
const { Variation } = require('../variation/variation.model');
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

exports.getAssets = async (req, res) => {
  try{
    const assets = await Asset.find().populate(['variations']).sort('name');
    res.send({ assets });
  }

  catch(err) {
    return res.status(400).send("Cannot get assets.");
  }
 
}

exports.getAsset = async (req, res) => {
  try{
    const asset = await Asset.findById(req.params.id).populate(['variations']);

    return res.send(asset);
  }

  catch(err) {
    return res.status(400).send("Cannot get asset.");
  }
}

exports.createAsset = async (req, res) => {
  try {
    const { category, name, variations } = req.body;
    const asset = await Asset.create({category, name});

    await Promise.all(variations.map(async variation => {
      const assetVariation = new Variation({ ...variation, asset: asset._id});

      await assetVariation.save();
      asset.variations.push(assetVariation);
    }));

    await asset.save();
    return res.send({asset});
  } 

  catch(err) {
    return res.status(400).send("Cannot create asset.");
  }
}

exports.updateAsset = async (req, res) => {
  try{
    const asset = await Asset.findByIdAndUpdate(req.params.id, req.body, { new: true });
  
    res.send(asset);
  } 

  catch(err) {
    return res.status(400).send("Cannot update asset.");
  }
}

exports.deleteAsset = async (req, res) => {
  try{
    const asset = await Asset.findByIdAndRemove(req.params.id);

    res.send(asset);
  }

  catch(err) {
    return res.status(400).send("Cannot delete asset.");
  }
}


