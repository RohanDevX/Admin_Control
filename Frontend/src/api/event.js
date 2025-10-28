import api from './http';

/** Get all events */
export const listEvents = async () =>
  (await api.get('/events')).data;

/** Get single event by ID */
export const getEvent = async id =>
  (await api.get(`/events/${id}`)).data;

/** Create a new event (with or without files) */
export const createEvent = async payload => {
  const isFormData = payload instanceof FormData;
  const config = isFormData
    ? { headers: { 'Content-Type': 'multipart/form-data' } }
    : {};
  return (await api.post('/events', payload, config)).data;
};

/** Update event by ID (with or without files) */
export const updateEvent = async (id, payload) => {
  const isFormData = payload instanceof FormData;
  const config = isFormData
    ? { headers: { 'Content-Type': 'multipart/form-data' } }
    : {};
  return (await api.put(`/events/${id}`, payload, config)).data;
};

/** Delete event */
export const deleteEvent = async id =>
  (await api.delete(`/events/${id}`)).data;