export function descriptionForFilter(filters) {
    var query_description = '';
  
    if (filters.category !== '') {
      query_description += filters.category + ' places';
    } else {
      query_description += 'any restaurant';
    }
  
    if (filters.city !== '') {
      query_description += ' in ' + filters.city;
    } else {
      query_description += ' located anywhere';
    }
  
    if (filters.price !== '') {
      query_description += ' with a price of ' + filters.price;
    } else {
      query_description += ' with any price';
    }
  
    if (filters.sort === 'Rating') {
      query_description += ' sorted by rating';
    } else if (filters.sort === 'Reviews') {
      query_description += ' sorted by # of reviews';
    }
  
    return query_description;
};
    