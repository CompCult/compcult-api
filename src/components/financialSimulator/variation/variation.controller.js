const { Variation } = require('./variation.model');
const { Asset } = require('../asset/asset.model');


exports.getVariations = async (req, res) => {
  try{
    const idUser = req.params.id;
    const user = await Asset.findById(idUser).populate(['variations']);
    const userVariations = user.variations;

    res.send(userVariations);
  }

  catch(err) {
    return res.status(400).send( "Cannot get variations." );
  }

}

exports.getVariation = async (req, res) => {
  try{
    const idVariation = await req.params.idVariation;
    const variation = await Variation.findById(idVariation);
    res.send(variation);
  }

  catch(err) {
    return res.status(400).send("Cannot get variation." );
  }
  
}


exports.createVariation = async (req, res) => {
  try {
    const paramsVariation = req.body;
    const variation = new Variation(paramsVariation);
    const idUser = req.params.id;
    const user = await Asset.findById(idUser).populate(['variations']);
    const variations = user.variations;

    variations.push(variation);
    
    await variation.save();
    await user.save();


    return res.send(variation);  
  }

  catch(err) {
    return res.status(400).send("Cannot create variation.");
    
  }
};

exports.updateVariation = async (req, res) => {
  try {
    const idVariation = await req.params.idVariation;
    const bodyVariation = await req.body;
    const variation = await Variation.findByIdAndUpdate(idVariation,
      bodyVariation, { new: true });

    return res.send(variation);
  }
 
 catch(err) {
   return res.status(400).send("Cannot update variation.");
 }
}

exports.deleteVariation = async (req, res) => {
  try {
    const idVariation = await req.params.idVariation;
    const variation = await Variation.findByIdAndRemove(idVariation);
  
    res.send(variation);
  }
  


  catch(err) {
    return res.status(400).send("Cannot delete variation.");
  }
}

