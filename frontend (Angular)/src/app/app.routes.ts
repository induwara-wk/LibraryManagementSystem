import { Routes } from '@angular/router';
import { BookListComponent } from './components/book-list/book-list.component';
import { BookFormComponent } from './components/book-form/book-form.component';
import { BookDetailComponent } from './components/book-detail/book-detail.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { authGuard, adminGuard, userGuard } from './helpers/auth.guard';
import { UserDashboardComponent } from './components/user/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'admin',
    loadChildren: () => import('./components/admin/admin.routes').then(m => m.ADMIN_ROUTES),
  },
  {
    path: 'user',
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { 
        path: 'dashboard', 
        component: UserDashboardComponent,
        canActivate: [userGuard]
      }
    ]
  },
  { path: 'books', component: BookListComponent, canActivate: [authGuard] },
  { path: 'books/new', component: BookFormComponent, canActivate: [authGuard] },
  { path: 'books/edit/:id', component: BookFormComponent, canActivate: [authGuard] },
  { path: 'books/:id', component: BookDetailComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
