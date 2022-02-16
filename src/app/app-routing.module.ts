import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./components/homepage/homepage.module').then(m => m.HomepageModule)
  },
  {
    path: 'homepage',
    loadChildren: () => import('./components/homepage/homepage.module').then(m => m.HomepageModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('./components/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'packages',
    loadChildren: () => import('./components/packages/packages.module').then(m => m.PackagesModule)
  },
  {
    path: 'package-details',
    loadChildren: () => import('./components/package-details/package-details.module').then(m => m.PackageDetailsModule)
  },
  {
    path: 'service-request',
    loadChildren: () => import('./components/service-request/service-request.module').then(m => m.ServiceRequestModule)
  },
  {
    path: 'payment',
    loadChildren: () => import('./components/payment/payment.module').then(m => m.PaymentModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
