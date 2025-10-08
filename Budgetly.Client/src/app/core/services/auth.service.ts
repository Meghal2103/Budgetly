import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
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

    get isLoggedIn(): boolean {
        return this._isLoggedIn;
    }

    get email(): string {
        return this._email;
    }

    get name(): string {
        return this._name;
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
        localStorage.setItem('authToken', token);
    }

    private isTokenExpired(token: JwtToken): boolean {
        if (!token.exp) {
            return true;
        }

        const expirationTime = token.exp * 1000;
        return Date.now() >= expirationTime;
    }

    public login(login: Login): void {
        const url = `${environment.baseUrl}/api/Auth/login`;

        this.http.post<APIResponse<object>>(url, login).subscribe({
            next: (response: APIResponse<object>) => {
                const token: string | null = response.token;
                if (token) {
                    this.decodeToken(token);
                }
                this.router.navigateByUrl('/dashboard');
                // this.toastr.success(response.message);
            },
            error: (errorResponse: HttpErrorResponse) => {
                const apiError: APIResponse<string> = errorResponse.error;
                // this.toastr.error(apiError.message);
            }
        })
    }

    public logout(): void {
        localStorage.removeItem('authToken');
        this._isLoggedIn = false;
        this._email = '';
        this._name = '';
        this.router.navigateByUrl('/login');
    }
}
