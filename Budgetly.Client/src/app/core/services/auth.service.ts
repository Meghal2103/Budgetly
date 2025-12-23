import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, map, throwError } from 'rxjs';
import { JwtToken } from '../models/auth/jwt-token.model';
import { jwtDecode } from 'jwt-decode';
import { Login } from '../models/auth/login.model';
import { environment } from 'src/environments/environment';
import { APIResponse } from '../models/api-response.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private _isLoggedIn: boolean = false;
    private _email: string = '';
    private _name: string = '';
    private _userId: number = 0;

    get isLoggedIn(): boolean {
        return this._isLoggedIn;
    }

    get email(): string {
        return this._email;
    }

    get name(): string {
        return this._name;
    }

    get userId(): number {
        return this._userId;
    }

    private http: HttpClient = inject(HttpClient);
    private router: Router = inject(Router);

    constructor() {
        const token = localStorage.getItem('authToken');
        if (token) {
            this.decodeToken(token);
        }
    }

    private decodeToken(token: string): void {
        const jwtPayload: JwtToken = jwtDecode<JwtToken>(token);
        if (this.isTokenExpired(jwtPayload)) {
            this.logout();
            // this.toastr.warning('Your session has expired. Please login again.');
            return;
        }

        this._isLoggedIn = true;
        this._email = jwtPayload.email;
        this._name = jwtPayload.name;
        // Get userId from nameid or sub claim (ClaimTypes.NameIdentifier)
        const userIdStr = jwtPayload.nameid || jwtPayload.sub || '';
        this._userId = userIdStr ? parseInt(userIdStr, 10) : 0;
        localStorage.setItem('authToken', token);
    }

    private isTokenExpired(token: JwtToken): boolean {
        if (!token.exp) {
            return true;
        }

        const expirationTime = token.exp * 1000;
        return Date.now() >= expirationTime;
    }

    public login(login: Login): Observable<string> {
        const url = `${environment.baseUrl}/api/Auth/login`;

        return this.http.post<APIResponse<object>>(url, login).pipe(
            map((response: APIResponse<object>) => {
                const token: string | null = response.token;
                if (token) {
                    this.decodeToken(token);
                    this.router.navigateByUrl('/dashboard');
                    return response.message || 'Login successful';
                }
                throw new Error('No token received');
            }),
            catchError((errorResponse: HttpErrorResponse) => {
                const apiError: APIResponse<string> = errorResponse.error;
                const errorMessage = apiError?.message || 'An error occurred during login';
                return throwError(() => new Error(errorMessage));
            })
        );
    }

    public logout(): void {
        localStorage.removeItem('authToken');
        this._isLoggedIn = false;
        this._email = '';
        this._name = '';
        this._userId = 0;
        this.router.navigateByUrl('/auth/login');
    }
}
