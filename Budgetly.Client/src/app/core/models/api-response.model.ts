export interface APIResponse<T> {
    success: boolean;
    message: string;
    token: string |  null;
    data: T | null;
}