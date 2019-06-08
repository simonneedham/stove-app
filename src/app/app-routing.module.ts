import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SettingsComponent } from './settings.component';
import { MainComponent } from './main.component';

// import { PageNotFoundComponent } from '@app/not-found.component';

const appRoutes: Routes = [
  { path: 'settings', component: SettingsComponent},
  { path: '', component: MainComponent }
  // { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
