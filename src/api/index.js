const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.navernyborshchu.com/api';

const getHeaders = () => ({
  'Content-Type': 'application/json',
});

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Fetch all pages from a paginated endpoint
const fetchAllPages = async (endpoint) => {
  let allResults = [];
  let url = `${API_BASE_URL}${endpoint}`;

  while (url) {
    const response = await fetch(url, { headers: getHeaders() });
    const data = await handleResponse(response);
    allResults = allResults.concat(data.results || []);
    url = data.next;
  }

  return allResults;
};

// Map API place to frontend format
const mapPlace = (apiPlace) => ({
  id: String(apiPlace.id),
  name: apiPlace.name,
  adress: apiPlace.address || '',
  location: {
    lat: parseFloat(apiPlace.latitude),
    lng: parseFloat(apiPlace.longitude),
  },
  country: apiPlace.country || '',
  city: apiPlace.city || '',
  type: apiPlace.type || '',
});

// Map API borsch to frontend format
const mapBorsch = (apiBorsch) => {
  const ratings = apiBorsch.ratings || [];
  let rating_salt = '', rating_meat = '', rating_beet = '';
  let rating_density = '', rating_aftertaste = '', rating_serving = '';
  let overall_rating = '';

  if (ratings.length > 0) {
    const totals = ratings.reduce((acc, r) => ({
      salt: acc.salt + (parseFloat(r.rating_salt) || 0),
      meat: acc.meat + (parseFloat(r.rating_meat) || 0),
      beet: acc.beet + (parseFloat(r.rating_beet) || 0),
      density: acc.density + (parseFloat(r.rating_density) || 0),
      aftertaste: acc.aftertaste + (parseFloat(r.rating_aftertaste) || 0),
      serving: acc.serving + (parseFloat(r.rating_serving) || 0),
      overall: acc.overall + (parseFloat(r.overall_rating) || 0),
      count: acc.count + 1,
    }), { salt: 0, meat: 0, beet: 0, density: 0, aftertaste: 0, serving: 0, overall: 0, count: 0 });

    const n = totals.count;
    rating_salt = (totals.salt / n).toFixed(1);
    rating_meat = (totals.meat / n).toFixed(1);
    rating_beet = (totals.beet / n).toFixed(1);
    rating_density = (totals.density / n).toFixed(1);
    rating_aftertaste = (totals.aftertaste / n).toFixed(1);
    rating_serving = (totals.serving / n).toFixed(1);
    overall_rating = (totals.overall / n).toFixed(1);
  }

  // Fallback: compute overall from rating_sum/rating_count if no ratings array
  if (!overall_rating && apiBorsch.rating_sum && apiBorsch.rating_count) {
    overall_rating = (apiBorsch.rating_sum / apiBorsch.rating_count).toFixed(1);
  }

  // Fallback: if no ratings array but has rating_sum/count, compute individual ratings
  if (ratings.length === 0 && apiBorsch.rating_count > 0) {
    const avg = apiBorsch.rating_sum / apiBorsch.rating_count;
    rating_salt = avg.toFixed(1);
    rating_meat = avg.toFixed(1);
    rating_beet = avg.toFixed(1);
    rating_density = avg.toFixed(1);
    rating_aftertaste = avg.toFixed(1);
    rating_serving = avg.toFixed(1);
    overall_rating = avg.toFixed(1);
  }

  // If still empty, use "—" for display (not 0)
  if (!rating_salt) rating_salt = '—';
  if (!rating_meat) rating_meat = '—';
  if (!rating_beet) rating_beet = '—';
  if (!rating_density) rating_density = '—';
  if (!rating_aftertaste) rating_aftertaste = '—';
  if (!rating_serving) rating_serving = '—';
  if (!overall_rating) overall_rating = '—';

  return {
    id_borsch: String(apiBorsch.id),
    name: apiBorsch.name || '',
    place_id: String(apiBorsch.place || ''),
    place_name: apiBorsch.place_name || '',
    place_city: apiBorsch.place_city || '',
    type_meat: apiBorsch.type_meat || '',
    rating_salt,
    rating_meat,
    rating_beet,
    rating_density,
    rating_aftertaste,
    rating_serving,
    overall_rating,
    price: apiBorsch.price ? `≈${apiBorsch.price} ₴` : '',
    weight: apiBorsch.grams ? `${apiBorsch.grams} g.` : '',
    photo_urls: apiBorsch.photo_urls || [],
    extras: apiBorsch.extras || '',
    dish_features: apiBorsch.dish_features || '',
    date: apiBorsch.date || '',
    rating_count: apiBorsch.rating_count || 0,
    rating_sum: apiBorsch.rating_sum || 0,
  };
};

// API for places
export const placesAPI = {
  getAll: async () => {
    const apiPlaces = await fetchAllPages('/places/');
    return apiPlaces.map(mapPlace);
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/places/${id}/`, { headers: getHeaders() });
    const data = await handleResponse(response);
    return mapPlace(data);
  },

  create: async (placeData) => {
    console.log('API: Create place (not implemented on backend)', placeData);
    return { ...placeData, id: Date.now().toString() };
  },

  update: async (id, updates) => {
    console.log('API: Update place (not implemented on backend)', id, updates);
    return { id, ...updates };
  },

  delete: async (id) => {
    console.log('API: Delete place (not implemented on backend)', id);
    return true;
  }
};

// API for borsch
export const borschAPI = {
  getAll: async () => {
    const apiBorsches = await fetchAllPages('/borsches/');
    return apiBorsches.map(mapBorsch);
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/borsches/${id}/`, { headers: getHeaders() });
    const data = await handleResponse(response);
    return mapBorsch(data);
  },

  create: async (borschData) => {
    console.log('API: Create borsch (not implemented on backend)', borschData);
    return { ...borschData, id_borsch: Date.now().toString() };
  },

  update: async (id, updates) => {
    console.log('API: Update borsch (not implemented on backend)', id, updates);
    return { id_borsch: id, ...updates };
  },

  delete: async (id) => {
    console.log('API: Delete borsch (not implemented on backend)', id);
    return true;
  },

  getByPlaceId: async (placeId) => {
    const all = await borschAPI.getAll();
    return all.filter(b => String(b.place_id) === String(placeId));
  }
};

// API for users (keep localStorage auth, no auth endpoint yet)
export const userAPI = {
  login: async (credentials) => {
    console.log('API: Login (localStorage only)', credentials);
    return {
      id: Date.now().toString(),
      email: credentials.email,
      name: credentials.name || 'Пользователь'
    };
  },

  register: async (userData) => {
    console.log('API: Register (localStorage only)', userData);
    return {
      id: Date.now().toString(),
      ...userData
    };
  },

  logout: async () => {
    console.log('API: Logout (localStorage only)');
    return true;
  },

  updateProfile: async (updates) => {
    console.log('API: Update profile (localStorage only)', updates);
    return updates;
  },

  changePassword: async (passwordData) => {
    console.log('API: Change password (not implemented)');
    return true;
  }
};

// API for comments
export const commentsAPI = {
  getAll: async () => {
    return fetchAllPages('/comments/');
  },
};

// API for ratings
export const ratingsAPI = {
  create: async (ratingData) => {
    console.log('API: Create rating (not implemented on backend)', ratingData);
    return { id: Date.now().toString(), ...ratingData };
  },

  update: async (id, updates) => {
    console.log('API: Update rating (not implemented on backend)', id, updates);
    return { id, ...updates };
  },

  getByBorschId: async (borschId) => {
    console.log('API: Get ratings by borsch (not implemented on backend)', borschId);
    return [];
  }
};

export const api = {
  places: placesAPI,
  borsch: borschAPI,
  user: userAPI,
  comments: commentsAPI,
  ratings: ratingsAPI
};

export default api;
