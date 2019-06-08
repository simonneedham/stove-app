import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { BurnLevelComponent } from './burnLevel.component';
import { CentreInfoComponent } from './centreInfo.component';
import { MainComponent } from './main.component';
import { SettingsComponent } from './settings.component';
import { StoveService } from './stove.service';
import { SettingsService } from './settings.service';
import { TitleBarComponent } from './titleBar.component';

@NgModule({
  declarations: [
    AppComponent, BurnLevelComponent, CentreInfoComponent,  MainComponent, SettingsComponent, TitleBarComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,

    AppRoutingModule
  ],
  providers: [StoveService, SettingsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
