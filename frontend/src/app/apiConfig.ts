// Centralized API configuration for TradeMind AI
// In production, this should come from an environment variable

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  MARKET: `${API_BASE_URL}/market`,
  PORTFOLIO: `${API_BASE_URL}/portfolio`,
  AUTH: `${API_BASE_URL}/auth`,
  ADVISOR: `${API_BASE_URL}/advisor`,
  NEWS: `${API_BASE_URL}/news`,
  INSIGHTS: `${API_BASE_URL}/insights`,
  TRADES: `${API_BASE_URL}/trades`,
};

export default API_BASE_URL;
