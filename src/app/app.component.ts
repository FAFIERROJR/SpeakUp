import { Component, ViewChild } from '@angular/core';

import { Platform, MenuController, Nav } from 'ionic-angular';

import{LoginPage} from "../pages/login/login";
import{SignUpPage} from "../pages/signup/signup"
import { ClassListPage } from '../pages/classlist/classlist';
import { ListPage } from '../pages/list/list';
import {WelcomePage} from '../pages/welcome/welcome'

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TestingPage } from '../pages/testing/testing';
import { AngularFireDatabase } from 'angularfire2/database';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // make WelcomePage the root (or first) page
  rootPage = WelcomePage;
  pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform,
    public menu: MenuController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public afDB: AngularFireDatabase
  ) {
    this.initializeApp();

    // set our app's pages
    this.pages = [
      {title:'Welcome', component: WelcomePage},
      {title: 'Login', component: LoginPage},
      {title:'Sign Up', component: SignUpPage},
      {title: 'Class List', component: ClassListPage},
      {title: 'My First List', component: ListPage},
      {title: 'Testing Page', component: TestingPage}
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    //this.nav.setRoot(page.component);
    this.nav.push(page.component);//this creates the page with a backbutton
  }
}
