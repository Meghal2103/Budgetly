export interface JwtToken {
    email: string;
    name: string;
    jti: string;
    exp: number;
    iss: string;
    aud: string;
}