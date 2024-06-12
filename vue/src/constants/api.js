export const BASE_URL = 'http://localhost:3000';

export const AUTH_ENDPOINTS = {
  LOGIN: `${BASE_URL}/auth/login`,
  REGISTER: `${BASE_URL}/auth/register`
};

export const ADMIN_ENDPONTS = {
  LOGIN: `${BASE_URL}/admin/login`
};

export const USER_ENDPOINTS = {
  GET_USER_BY_ID: (userId) => `${BASE_URL}/user/${userId}`,
  GET_ALL_USERS: `${BASE_URL}/user/`,
  GET_USERS_BY_BLOCK_STATUS: `${BASE_URL}/user/block-list`,
  UPDATE_EMAIL: (userId) => `${BASE_URL}/user/update-email/${userId}`,
  UPDATE_PASSWORD: (userId) => `${BASE_URL}/user/update-password/${userId}`,
  UPDATE_INFO: `${BASE_URL}/user/user-info`,
  UPDATE_BLOCK_STATUS: (userId) => `${BASE_URL}/user/block-user/${userId}`
};

export const ACCESS_ENDPOINTS = {
  CREATE_ACCESS_REQUEST: `${BASE_URL}/access/access-request`,
  UPDATE_REQUEST_STATUS: (requestId) => `${BASE_URL}/access/access-request/${requestId}`,
  GET_REQUESTS_BY_USER_ID: (userId) => `${BASE_URL}/access/access-request/${userId}`,
  GET_ALL_REQUESTS: `${BASE_URL}/access/access-requests`,
  CHECK_REQUEST: (requesterId, ownerId) => `${BASE_URL}/access/access-request/check/${requesterId}/${ownerId}`,
  CHECK_REQUEST_STATUS: (requesterId, ownerId) => `${BASE_URL}/access/access-request/status/${requesterId}/${ownerId}`
};
