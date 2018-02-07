import{Component} from '@angular/core'
import{NavController, NavParams, AlertController} from 'ionic-angular'
import { NavGroup } from 'ionic-angular/navigation/nav-util'
import{LoginPage} from '../login/login'
import{SignUpPage} from '../signup/signup'
import{TestingPage} from '../testing/testing'
import { HelloIonicPage } from '../hello-ionic/hello-ionic';
import { ChatroomPage } from '../chatroom/chatroom';
import { PARAMETERS } from '@angular/core/src/util/decorators';
import { NewPage } from '../new/new';
import { AngularFireAuth } from 'angularfire2/auth';
import { Signup2Page } from '../signup2/signup2';

@Component({
    selector: 'page-Welcome',
    templateUrl:'welcome.html'
})
export class WelcomePage{
    randomTempID: number;
    username: any;
    data: any;
    uid: any;
    constructor(public navCtrl:NavController, public navParams: NavParams, public afAuth:AngularFireAuth, public alertCtrl: AlertController){
        this.username = navParams.get('username');
        this.uid = navParams.get('uid');
        this.randomTempID = navParams.get('randomTempID');

        console.log('welcome: ' + this.uid);
         if(this.username === undefined){
            //makes it easier to access the chatroom when developing, but need to login once. 
            this.username = "admin";
            this.randomTempID = 0;
        }

    }

    goLoginPage(){
        this.navCtrl.push(LoginPage);
    }
    goSignUpPage(){
        this.navCtrl.push(SignUpPage);
    }

    goTestPage(){
        // /**Create an alert when the user is not sign in and accessing chat */
        // if(this.username == undefined){
        //     let alert = this.alertCtrl.create(({
        //         title:'Access Denied',
        //         subTitle: "Please login to use chat.",
        //         buttons: ['Dismiss']
        //     }));
        //     alert.present();
        // }
        // else{
        //     this.navCtrl.push(TestingPage, {'chatroomID': 1, 'username': this.username})
        // }
        
        this.navCtrl.push(TestingPage, {'chatroomID': 1, 'username': this.username, 'uid': this.uid, 'randomTempID': this.randomTempID})
        
    }

    goHelloIonicPage(){
        this.navCtrl.push(HelloIonicPage);
    }

    goChatroomPage(){
        if(this.username == undefined){
            let alert = this.alertCtrl.create(({
                title:'Access Denied',
                subTitle: "Please login to use chat.",
                buttons: ['Dismiss']
            }));
            alert.present();
        }
        else{
            this.navCtrl.push(ChatroomPage, {'chatroomID': 0});
        }
    }

    goNewPage(){
        this.navCtrl.push(NewPage);
    }

    goSignup2Page(){
        this.navCtrl.push(Signup2Page);
    }

    signOut(): void {
        this.afAuth.auth.signOut(); 
        this.navCtrl.push(LoginPage);
    }
}