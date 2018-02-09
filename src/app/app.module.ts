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
import { LoginComponent } from './login/login.component';
import { AuthService } from './core/auth.service';

import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SinglePlayerComponent } from './single-player/single-player.component';
import { MultiPlayerComponent } from './multi-player/multi-player.component';
import { TutorialComponent } from './tutorial/tutorial.component';
import { IntroComponent } from './intro/intro.component';
import { ChatComponent } from './chat/chat.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { NetworkingComponent } from './networking/networking.component';
import { MultiplayerLobbyComponent } from './multiplayer-lobby/multiplayer-lobby.component';
import { SettingsComponent } from './settings/settings.component';
import { SplashScreenComponent } from './splash-screen/splash-screen.component';
import { TypingAnimationModule } from 'angular-typing-animation';
import {GameService} from './game.service';

const appRoutes: Routes = [
  { path: '', pathMatch: 'full', component: SplashScreenComponent},
  { path: 'home', pathMatch: 'full', component: HomeComponent},
  { path: 'single-player', pathMatch: 'full', component: SinglePlayerComponent},
  { path: 'multi-player', pathMatch: 'full', component: MultiPlayerComponent},
  { path: 'tutorial', pathMatch: 'full', component: TutorialComponent},
  { path: 'login', pathMatch: 'full', component: LoginComponent},
  { path: 'board', pathMatch: 'full', component: GameBoardComponent},
  { path: 'intro', pathMatch: 'full', component: IntroComponent},
  { path: 'multiPlayerLobby', pathMatch: 'full', component: MultiplayerLobbyComponent},
  { path: '**', redirectTo: 'home'}
];

@NgModule({
  declarations: [
    AppComponent,
    GameBoardComponent,
    CellComponent,
    LoginComponent,
    HomeComponent,
    SinglePlayerComponent,
    MultiPlayerComponent,
    TutorialComponent,
    IntroComponent,
    ChatComponent,
    LeaderboardComponent,
    NetworkingComponent,
    MultiplayerLobbyComponent,
    SettingsComponent,
    SplashScreenComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule,
    TypingAnimationModule
  ],
  providers: [AuthService, GameService],
  bootstrap: [AppComponent]
})
export class AppModule { }
