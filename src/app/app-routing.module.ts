import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  
  {
    path: '',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'SignUp',
    loadChildren: () => import('./sign-up/sign-up.module').then( m => m.SignUpPageModule)
  },
  {
    path: 'map',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'map2',
    loadChildren: () => import('./course-ongoing/course-ongoing.module').then( m => m.CourseOngoingPageModule)
  },
  {
    path: 'mapdriver',
    loadChildren: () => import('./driver-map/driver-map.module').then( m => m.DriverMapPageModule)
  },
  {
    path: 'mapclient',
    loadChildren: () => import('./client-map/client-map.module').then( m => m.ClientMapPageModule)
  },
  {
    path: 'history',
    loadChildren: () => import('./history/history.module').then( m => m.HistoryPageModule)
  }

  
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
