import { Component, Input } from '@angular/core';
import {AngularFireDatabase, AngularFireObject, AngularFireList} from 'angularfire2/database';
import {Observable} from 'rxjs';
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
  pointsElementTextContent: string;
  newPoints: any;
  commentPoints: any;
  commentID: any;
  i: any;
  data: any;
  
  comments: Observable<any[]>;
  @Input() chatroomID: string;
  chatroomRef: any;

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
    this.comments = this.chatroomRef.valueChanges()
  }

  /**
   * 
   * @param event click event
   * @param commentID comment.commentKey
   * @param commentPoints comment.points
   * @param pointDelta 1 or -1
   */
  vote(event, commentID, commentPoints, pointDelta){
    console.log(commentID + " " + commentPoints + " " + pointDelta);
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
