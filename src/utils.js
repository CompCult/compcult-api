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
    query[prop] = { $regex: new RegExp(query[prop]), $options: 'i' };
  });

  return query;
};

exports.randomBytes = (len) => {
  return crypto
    .randomBytes(Math.ceil(len / 2))
    .toString('hex')
    .slice(0, len);
};
