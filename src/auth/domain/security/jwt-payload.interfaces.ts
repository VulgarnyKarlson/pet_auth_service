export interface JwtAuthPayload {
    username: string;
    sub: string;
    iat?: number;
    exp?: number;
}

export interface JwtRefreshPayload extends JwtAuthPayload {
    refreshToken: string;
}
