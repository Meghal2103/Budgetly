import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-primary-header',
    imports: [RouterModule],
    templateUrl: './primary-header.component.html',
    styleUrls: ['./primary-header.component.scss']
})
export class PrimaryHeaderComponent {
    public authService: AuthService = inject(AuthService);
}
