export const clearAuthTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

export const clearChildTokens = () => {
  localStorage.removeItem('childAccessToken');
};
