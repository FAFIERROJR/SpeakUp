import { Component, Input } from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import {Observable} from 'rxjs';
import { NavParams } from 'ionic-angular/navigation/nav-params';

/**
 * Generated class for the CommentsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'comments',
  templateUrl: 'comments.html'
})
export class CommentsComponent {

  comments: Observable<any[]>;
  @Input() chatroomID: string;
  chatroomRef: any;

  constructor(public afDB:AngularFireDatabase, public navParams: NavParams) {
  }
  
  ngOnInit(){
    this.chatroomID = this.navParams.get('chatroomID');
    this.chatroomRef = this.afDB.list('chatrooms/' + this.chatroomID + '/comments');
    this.comments = this.chatroomRef.valueChanges()
  }

}
