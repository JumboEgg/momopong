import useAuthStore from '@/stores/authStore';

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

  getActiveToken(forceParent: boolean = false): string | null {
    if (forceParent) {
      // authStore에서 직접 토큰 가져오기
      const parentToken = useAuthStore.getState().accessToken;
      return parentToken;
    }
    return this.state.childToken || useAuthStore.getState().accessToken;
  }

  getChildToken(): string | null {
    return this.state.childToken;
  }

  getCurrentChildId(): number | null {
  return this.state.currentChildId;
}

  getRefreshToken(): string | null {
    return this.state.refreshToken;
  }

  setParentToken(token: string | null) {
    this.state.parentToken = token;
  }

  setChildToken(token: string | null) {
    this.state.childToken = token;
  }

  setCurrentChildId(childId: number | null) {
    this.state.currentChildId = childId;
  }

  setRefreshToken(token: string | null) {
    this.state.refreshToken = token;
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
