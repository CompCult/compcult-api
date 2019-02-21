function _paginate (page, limit) {
  limit = Number(limit) || 0;
  page = Number(page) || 0;
  if (limit && page) {
    page = (page - 1) * limit;
  }

  return {
    limit: limit,
    skip: page
  };
}

function _regexQuery (query, regProps) {
  regProps.forEach(prop => {
    query[prop] = { $regex: new RegExp(query[prop]), $options: 'i' };
  });

  return query;
}

module.exports = {
  paginate: _paginate,
  regexQuery: _regexQuery
};
