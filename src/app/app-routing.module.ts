import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [ 
  
  {
    path: '',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
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
  },
  {
    path: 'sign-up',
    loadChildren: () => import('./sign-up/sign-up.module').then( m => m.SignUpPageModule)
  },
  {
    path: 'account',
    loadChildren: () => import('./account/account.module').then( m => m.AccountPageModule)
  },
  {
    path: 'course-ongoing',
    loadChildren: () => import('./course-ongoing/course-ongoing.module').then( m => m.CourseOngoingPageModule)
  },
  {
    path: 'course-confirmation',
    loadChildren: () => import('./course-confirmation/course-confirmation.module').then( m => m.CourseConfirmationPageModule)
  },
  {
    path: 'maps',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'client-home',
    loadChildren: () => import('./client-home/client-home.module').then( m => m.ClientHomePageModule)
  }

  
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
