// services/tokenService.ts
interface TokenState {
  parentToken: string | null;
  childToken: string | null;
  refreshToken: string | null;
  currentChildId: number | null;
}

class TokenService {
  private state: TokenState = {
    parentToken: null,
    childToken: null,
    refreshToken: null,
    currentChildId: null,
  };

  setParentToken(token: string | null) {
    this.state.parentToken = token;
  }

  setChildToken(token: string | null) {
    this.state.childToken = token;
  }

  setRefreshToken(token: string | null) {
    this.state.refreshToken = token;
  }

  getActiveToken() {
    return this.state.childToken || this.state.parentToken;
  }

  getRefreshToken() {
    return this.state.refreshToken;
  }

  getCurrentChildId() {
    return this.state.currentChildId;
  }

  clearAllTokens() {
    this.state = {
      parentToken: null,
      childToken: null,
      refreshToken: null,
      currentChildId: null,
    };
  }
}

export const tokenService = new TokenService();
