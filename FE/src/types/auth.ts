export interface JwtToken {
  grantType?: string;
  accessToken: string;
  refreshToken: string;
}

export interface ParentDto {
  parentId: number;
  email: string;
  name: string;
  phone: string;
}

// interface ParentStorageDto { // 로컬 저장용 Dto
//   id: number;
//   name: string; // 화면 표시용
// }

export interface RefreshResponse {
  jwtToken: JwtToken;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  parentDto: ParentDto; // 부모 계정 정보
  jwtToken: JwtToken; // 토큰 정보
}
