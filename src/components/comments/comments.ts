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

  voteUp(event){
    //retreive the id for each "comment" which is placed on the button div.
    let commentID = event.target.parentElement.getAttribute('id');
    //retrive the text of the points that is displayed between the element with the id {{comment.commentKey}}_points. <element id='{{comment.commentKey}}_points'> a number </element>
    this.pointsElementTextContent = document.getElementById(commentID + '_points').textContent;

    /**
     * check to see if the text content is blank
     * if it is blank 
     *  then make this.commentPoint = 0 
     *  then add it by i
     * else
     *  parse the text content to become an int 
     *  then add it by i
     */
    if(this.pointsElementTextContent.trim().length === 0){
      this.commentPoints = 0;
      this.newPoints = this.commentPoints + this.i;
    }
    else{
      this.commentPoints = parseInt(this.pointsElementTextContent);
      this.newPoints = this.commentPoints + this.i;
    }

    /**
     * update the comment with the key {{comment.commentKey}} with a new property of points and the points value
     */
    this.afDB.object('chatrooms/' + this.chatroomID + '/comments/' + commentID).update({
      points: this.newPoints
    }); 
  }

  voteDown(event){
    //retreive the id for each "comment" which is placed on the button div.
    let commentID = event.target.parentElement.getAttribute('id');
    //retrive the text of the points that is displayed between the element with the id {{comment.commentKey}}_points. <element id='{{comment.commentKey}}_points'> a number </element>
    this.pointsElementTextContent = document.getElementById(commentID + '_points').textContent;

    /**
     * check to see if the text content is blank
     * if it is blank 
     *  then make this.commentPoint = 0 
     *  then subtract it by i
     * else
     *  parse the text content to become an int 
     *  then subtract it by i
     */
    if(this.pointsElementTextContent.trim().length === 0){
      this.commentPoints = 0;
      this.newPoints = this.commentPoints - this.i;
    }
    else{
      this.commentPoints = parseInt(this.pointsElementTextContent);
      this.newPoints = this.commentPoints - this.i;
    }

    /**
     * update the comment with the key {{comment.commentKey}} with a new property of points and the points value
     */
    this.afDB.object('chatrooms/' + this.chatroomID + '/comments/' + commentID).update({
      points: this.newPoints
    }); 
  }
}
