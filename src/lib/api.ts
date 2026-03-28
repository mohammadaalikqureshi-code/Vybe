import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('vybe_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const searchApi = async (q: string, type: 'all' | 'users' | 'posts' | 'tags' | 'audio' = 'all') => {
  const { data } = await api.get(`/search`, { params: { q, type } });
  return data;
};

export const getPosts = async () => {
  const { data } = await api.get('/posts');
  return data;
};

export const getMe = async () => {
  const { data } = await api.get('/auth/me');
  return data;
};

// Privacy, block, mute, and follow requests
export const togglePrivacy = async (userId: string, isPrivate: boolean) => {
  const { data } = await api.put(`/users/${userId}/privacy`, { isPrivate });
  return data;
};

export const getBlockedUsers = async (userId: string) => {
  const { data } = await api.get(`/users/${userId}/blocks`);
  return data;
};

export const toggleBlockUser = async (userId: string, targetId: string) => {
  const { data } = await api.post(`/users/${userId}/block/${targetId}`);
  return data;
};

export const getMutedUsers = async (userId: string) => {
  const { data } = await api.get(`/users/${userId}/mutes`);
  return data;
};

export const toggleMuteUser = async (userId: string, targetId: string) => {
  const { data } = await api.post(`/users/${userId}/mute/${targetId}`);
  return data;
};

export const getFollowRequests = async (userId: string) => {
  const { data } = await api.get(`/users/${userId}/follow-requests`);
  return data;
};

export const acceptFollowRequest = async (userId: string, senderId: string) => {
  const { data } = await api.post(`/users/${userId}/follow-requests/${senderId}/accept`);
  return data;
};
