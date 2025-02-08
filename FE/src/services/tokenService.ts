// services/tokenService.ts
interface TokenState {
  parentToken: string | null;
  childToken: string | null;
  refreshToken: string | null;
  currentChildId: number | null;
}
class TokenService {
  private state: TokenState = {
    parentToken: localStorage.getItem('auth-storage')
      ? JSON.parse(localStorage.getItem('auth-storage') || '{}').state?.accessToken || null : null,
    childToken: null,
    refreshToken: localStorage.getItem('auth-storage')
      ? JSON.parse(localStorage.getItem('auth-storage') || '{}').state?.refreshToken || null : null,
    currentChildId: null,
  };

  // authStore의 상태 변경을 구독하는 메서드
  syncWithAuth(tokens: { accessToken: string | null, refreshToken: string | null }) {
    this.state.parentToken = tokens.accessToken;
    this.state.refreshToken = tokens.refreshToken;
    console.log('TokenService synced:', {
      parentToken: !!this.state.parentToken,
      refreshToken: !!this.state.refreshToken,
    });
  }

  getActiveToken(forceParent: boolean = false): string | null {
    if (forceParent) {
      return this.state.parentToken;
    }
    return this.state.childToken || this.state.parentToken;
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
