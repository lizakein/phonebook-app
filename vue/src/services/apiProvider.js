import axios from "axios";
import { BASE_URL, ACCESS_ENDPOINTS } from "@/constants/api";

const apiProvider = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

export default {
  async fetchAllAccessRequests(params = {}) {
    try {
      const response = await apiProvider.get(ACCESS_ENDPOINTS.GET_ALL_REQUESTS, {
        params: params
      });
      return response.data.requests.map(request => ({
        ...request,
        newStatus: request.status
      }));
    } catch (error) {
      throw error;
    }
  },

  async fetchAccessRequests(userId, status) {
    try {
      const response = await apiProvider.get(ACCESS_ENDPOINTS.GET_REQUESTS_BY_USER_ID(userId));
      const requests = response.data.requests;
      if (status) 
        return requests.filter(request => request.status === status);
      else
        return requests;
    } catch (error) {
      throw error;
    }
  },

  async updateAccessRequestStatus(requestId, status) {
    try {
      await apiProvider.put(ACCESS_ENDPOINTS.UPDATE_REQUEST_STATUS(requestId), { status });
    } catch (error) {
      throw error;
    }
  },

  async requestAccess(userId) {
    try {
      const response = await apiProvider.post(ACCESS_ENDPOINTS.CREATE_ACCESS_REQUEST, { ownerId: userId });
      return response;
    } catch(error) {
      throw error;
    }
  },

  async checkAccessRequest(requesterId, ownerId) {
    try {
      const response = await apiProvider.get(ACCESS_ENDPOINTS.CHECK_REQUEST(requesterId, ownerId));
      return response;
    } catch (error) {
      throw error;
    }
  },

  async chackAccessStatus(requesterId, ownerId) {
    try {
      const response = await apiProvider.get(ACCESS_ENDPOINTS.CHECK_REQUEST_STATUS(requesterId, ownerId));
      return response;
    } catch (error) {
      throw error;
    }
  }
};