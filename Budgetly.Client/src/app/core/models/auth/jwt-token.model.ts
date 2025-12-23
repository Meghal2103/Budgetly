export interface JwtToken {
    email: string;
    name: string;
    nameid?: string; // UserId from ClaimTypes.NameIdentifier
    sub?: string; // Alternative claim name for userId
    jti: string;
    exp: number;
    iss: string;
    aud: string;
}