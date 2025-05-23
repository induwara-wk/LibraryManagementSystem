import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BookModalComponent } from './book-modal/book-modal.component';
import { adminGuard } from '../../helpers/auth.guard';

export const ADMIN_ROUTES: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [adminGuard]
  },
]; 