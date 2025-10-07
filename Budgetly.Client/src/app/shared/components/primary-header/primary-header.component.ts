import { Component, inject } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
    selector: 'app-primary-header',
    templateUrl: './primary-header.component.html',
    styleUrls: ['./primary-header.component.scss']
})
export class PrimaryHeaderComponent {
    public authService: AuthService = inject(AuthService);
}
