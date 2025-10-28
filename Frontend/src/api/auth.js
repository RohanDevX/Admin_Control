import api from './http';

export const login = async (email, password) => {
  const res = await api.post('/auth/login', { email, password });
  return res.data;   // { accessToken, user }
};

export const refresh = async () => {
  const res = await api.post('/auth/refresh');
  return res.data;   // { accessToken }
};

export const logout = async () => {
  await api.post('/auth/logout');
};
