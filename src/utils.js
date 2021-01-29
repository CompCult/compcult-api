const crypto = require('crypto');

exports.paginate = (page, limit) => {
  limit = Number(limit) || 0;
  page = Number(page) || 0;
  if (limit && page) {
    page = (page - 1) * limit;
  }

  return {
    limit: limit,
    skip: page
  };
};

exports.regexQuery = (query, regProps) => {
  regProps.forEach(prop => {
    let value = query[prop];
    if(value){
      value = value.replaceAll(RegExp('[aáâàäã]', 'gi'), '[aáâàäã]');
      value = value.replaceAll(RegExp('[eéêèë]', 'gi'), '[eéêèë]');
      value = value.replaceAll(RegExp('[iíîìï]', 'gi'), '[iíîìï]');
      value = value.replaceAll(RegExp('[oóôòöõ]', 'gi'), '[oóôòöõ]');
      value = value.replaceAll(RegExp('[uúûùü]', 'gi'), '[uúûùü]');
      value = value.replaceAll(RegExp('[cç]', 'gi'), '[cç]');
    }
    query[prop] = { $regex: new RegExp(value), $options: 'i' };
  });

  return query;
};

exports.randomBytes = (len) => {
  return crypto
    .randomBytes(Math.ceil(len / 2))
    .toString('hex')
    .slice(0, len);
};
