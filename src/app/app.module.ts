import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { GameBoardComponent } from './game-board/game-board.component';
import { CellComponent } from './cell/cell.component';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../environments/environment';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { AuthService } from './core/auth.service';
import {MusicService} from './music.service';

import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TutorialComponent } from './tutorial/tutorial.component';
import { IntroComponent } from './intro/intro.component';
import { ChatComponent } from './chat/chat.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { NetworkingComponent } from './networking/networking.component';
import { MultiplayerLobbyComponent } from './multiplayer-lobby/multiplayer-lobby.component';
import { SettingsComponent } from './settings/settings.component';
import { SplashScreenComponent } from './splash-screen/splash-screen.component';
import { TypingAnimationModule } from 'angular-typing-animation';
import { ParticlesModule } from 'angular-particle';
import {GameService} from './game.service';
import {NgxSlideshowModule} from 'ngx-slideshow';
import {FormsModule} from "@angular/forms";
import {NgbModule, NgbTab, NgbTabContent, NgbTabset} from '@ng-bootstrap/ng-bootstrap';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { GameOverWinComponent } from './game-over-win/game-over-win.component';
import { GameOverLoseComponent } from './game-over-lose/game-over-lose.component';
import { SingleSetupComponent } from './single-setup/single-setup.component';
import { MultiSetupComponent } from './multi-setup/multi-setup.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { GuestInfoComponent } from './guest-info/guest-info.component';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { EmailUserInfoComponent } from './email-user-info/email-user-info.component';
import {MatSliderModule} from '@angular/material';

const appRoutes: Routes = [
  { path: '', pathMatch: 'full', component: SplashScreenComponent},
  { path: 'home', pathMatch: 'full', component: HomeComponent},
  { path: 'chat', pathMatch: 'full', component: ChatComponent},
  { path: 'tutorial', pathMatch: 'full', component: TutorialComponent},
  { path: 'main-menu', pathMatch: 'full', component: MainMenuComponent},
  { path: 'board/:id/:id2/:id3', pathMatch: 'full', component: GameBoardComponent},
  { path: 'intro', pathMatch: 'full', component: IntroComponent},
  { path: 'multiPlayerLobby/:id/:id2/:id3/:id4/:id5', pathMatch: 'full', component: MultiplayerLobbyComponent},
  { path: 'game-over-lose', pathMatch: 'full', component: GameOverLoseComponent},
  { path: 'game-over-win', pathMatch: 'full', component: GameOverWinComponent},
  { path: 'single-setup', pathMatch: 'full', component: SingleSetupComponent},
  { path: 'multi-setup/:id', pathMatch: 'full', component: MultiSetupComponent},
  { path: 'leaderboard', pathMatch: 'full', component: LeaderboardComponent},
  { path: 'sign-in', pathMatch: 'full', component: SignInComponent},
  { path: 'guest-info', pathMatch: 'full', component: GuestInfoComponent},
  { path: 'email-user-info', pathMatch: 'full', component: EmailUserInfoComponent},
  { path: '**', redirectTo: 'home'}
];

@NgModule({
  declarations: [
    AppComponent,
    GameBoardComponent,
    CellComponent,
    MainMenuComponent,
    HomeComponent,
    TutorialComponent,
    IntroComponent,
    ChatComponent,
    LeaderboardComponent,
    NetworkingComponent,
    MultiplayerLobbyComponent,
    SettingsComponent,
    SplashScreenComponent,
    ToolbarComponent,
    GameOverWinComponent,
    GameOverLoseComponent,
    SingleSetupComponent,
    MultiSetupComponent,
    SignInComponent,
    GuestInfoComponent,
    EmailUserInfoComponent,
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule,
    FormsModule,
    TypingAnimationModule,
    ParticlesModule,
    MatButtonToggleModule,
    NgxSlideshowModule.forRoot(),
    NgbModule.forRoot(),
    MatSliderModule
  ],
  providers: [AuthService, GameService, NgbTab, NgbTabset, ChatComponent, MusicService],
  bootstrap: [AppComponent]
})
export class AppModule { }
