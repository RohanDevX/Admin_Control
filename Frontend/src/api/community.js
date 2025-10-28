// import api from './http';

// export const listCommunities = async () => (await api.get('/community')).data;

// export const getCommunity = async id => (await api.get(`/community/${id}`)).data;

// export const createCommunity = async payload =>
//   (await api.post('/community', payload)).data;

// export const updateCommunity = async (id, payload) =>
//   (await api.put(`/community/${id}`, payload)).data;

// export const deleteCommunity = async id =>
//   (await api.delete(`/community/${id}`)).data;


import api from './http';

/** Get all communities */
export const listCommunities = async () =>
  (await api.get('/community')).data;

/** Get single community by ID */
export const getCommunity = async id =>
  (await api.get(`/community/${id}`)).data;

/** Create a new community (with or without files) */
export const createCommunity = async payload => {
  const isFormData = payload instanceof FormData;
  const config = isFormData
    ? { headers: { 'Content-Type': 'multipart/form-data' } }
    : {};
  return (await api.post('/community', payload, config)).data;
};

/** Update community by ID (with or without files) */
export const updateCommunity = async (id, payload) => {
  const isFormData = payload instanceof FormData;
  const config = isFormData
    ? { headers: { 'Content-Type': 'multipart/form-data' } }
    : {};
  return (await api.put(`/community/${id}`, payload, config)).data;
};

/** Delete community */
export const deleteCommunity = async id =>
  (await api.delete(`/community/${id}`)).data;
