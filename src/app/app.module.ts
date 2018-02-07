import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import {FormsModule} from '@angular/forms'
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { ItemDetailsPage } from '../pages/item-details/item-details';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';
import {WelcomePage} from '../pages/welcome/welcome';
import { SignUpPage } from '../pages/signup/signup';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import {AngularFireAuthModule} from 'angularfire2/auth';

export const firebaseConfig = {
  apiKey: 'AIzaSyAKyDpPR70-RyF_GJPxcKPXfL2TV6tXTzU',
  authDomain: "speakup-6419a.firebaseapp.com",
  databaseURL: "https://speakup-6419a.firebaseio.com",
  storageBucket: "speakup-6419a.appspot.com",
  messagingSenderId: "567399258044"
}

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MainPage } from '../pages/main/main';
import { TestingPage } from '../pages/testing/testing';
import {ChatroomPage} from '../pages/chatroom/chatroom'
import { Comment } from './comment';
import { CommentsComponent } from '../components/comments/comments';
import {NewPage} from '../pages/new/new'
import {Signup2Page} from '../pages/signup2/signup2'

@NgModule({
  declarations: [
    MyApp,
    HelloIonicPage,
    ItemDetailsPage,
    ListPage,
    LoginPage,
    WelcomePage,
    SignUpPage,
    MainPage,
    TestingPage,
    ChatroomPage,
    CommentsComponent,
    NewPage,
    Signup2Page
  ],
  imports: [
    BrowserModule,
    FormsModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HelloIonicPage,
    ItemDetailsPage,
    ListPage,
    LoginPage,
    WelcomePage,
    SignUpPage,
    MainPage,
    TestingPage,
    ChatroomPage,
    NewPage,
    Signup2Page
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
