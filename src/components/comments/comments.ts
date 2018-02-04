import { Component, Input } from '@angular/core';
import {AngularFireDatabase, AngularFireObject, AngularFireList} from 'angularfire2/database';
import {Observable, Subscription} from 'rxjs';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { query } from '@angular/core/src/animation/dsl';

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
  userOccupation: Subscription;
 
  checkOccupation: AngularFireList<{}>;
  pointsElementTextContent: string;
  newPoints: any;
  commentPoints: any;
  commentID: any;
  i: any;
  data: any;
  comments: Observable<any[]>;
  @Input() chatroomID: string;
  chatroomRef: any;
  uid: any;
  isInstructor: boolean = false;
  constructor(public afDB:AngularFireDatabase, public navParams: NavParams, ) {
    this.i = 1;
  }
  
  /**
   * this method is for testing and logging the id of the parent of the element that was clicked
   */
  // onClick(event) {
  //   //console.log(event);
  //   console.log(event.target.parentElement.getAttribute('id'));
  // }

  /**
   * when comments are init, intialize these
   */
  ngOnInit(){
    this.chatroomID = this.navParams.get('chatroomID');
    this.chatroomRef = this.afDB.list('chatrooms/' + this.chatroomID + '/comments');
    this.comments = this.chatroomRef.valueChanges();

    /**
     * check if the user is an instructor using the userProfile database and the id of the user logged on
     * and change the value of occupation and if it contains 'instructor'.
     * need to add the property manually in firebase. userProfile>[uid]> {occupation: 'instructor'}
     */
    this.uid = this.navParams.get('uid');
    console.log('chatroom: ' + this.uid);
    this.userOccupation = this.afDB.list('userProfile/' + this.uid).valueChanges().subscribe(data=>{
      if(data.indexOf('instructor') != -1){
        console.log(data.indexOf('instructor') + ' is instructor');
        this.isInstructor = true;         
      }
      else{   
        console.log(data.indexOf('instructor') + ' not instructor');
        this.isInstructor = false;
      }
    });
  }

  removeComment(event, commentID){
    //console.log(commentID);
    this.afDB.object('chatrooms/' + this.chatroomID + '/comments/' + commentID).remove();
  }

  /**
   * 
   * @param event click event
   * @param commentID comment.commentKey
   * @param commentPoints comment.points
   * @param pointDelta 1 or -1
   */
  vote(event, commentID, commentPoints, pointDelta){
    //console.log(commentID + " " + commentPoints + " " + pointDelta);
    /**
     * calculate new points
     */
    let newPoints = commentPoints + pointDelta;

    /**
     * update database
     */

    this.afDB.object('chatrooms/' + this.chatroomID + '/comments/' + commentID).update({
      points: newPoints
    }); 
  }
}
