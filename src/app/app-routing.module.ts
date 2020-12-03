import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
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
    path: 'confirm',
    loadChildren: () => import('./course-confirmation/course-confirmation.module').then( m => m.CourseConfirmationPageModule)
  }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
