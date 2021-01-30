import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { FourWinComponent } from './games/four-win/four-win.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WinnerDialogComponent } from './games/four-win/winner-dialog/winner-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { OpenSessionComponent } from './games/four-win/open-session/open-session.component';
import { GlobalService } from './global.service';

const routes: Routes = [
  {
    path: 'four-win',
    component: FourWinComponent
  },
  {
    path: '',
    component: LandingPageComponent
  }
  // {
  //   path: 'four-win/:type',
  //   component: FourWinComponent
  // }
];

@NgModule({
  declarations: [
    AppComponent,
    FourWinComponent,
    WinnerDialogComponent,
    LandingPageComponent,
    OpenSessionComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    BrowserAnimationsModule,
    NgbModule,
    MatDialogModule
  ],
  providers: [GlobalService],
  bootstrap: [AppComponent]
})
export class AppModule {}
