import { Component, Input, ViewChild, ViewChildren, ElementRef } from '@angular/core';
import {AngularFireDatabase, AngularFireObject, AngularFireList} from 'angularfire2/database';
import {AngularFireAuth} from 'angularfire2/auth'
import {Observable, Subscription} from 'rxjs';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { query } from '@angular/core/src/animation/dsl';
import { Comment } from '../../app/comment';
import { Vote } from '../../models/vote';

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
  @ViewChildren('comments') private commentsItem: ElementRef;
  @ViewChild('commentlist') private commentlist: ElementRef;
  checkOccupation: AngularFireList<{}>;
  pointsElementTextContent: string;
  newPoints: any;
  commentPoints: any;
  commentID: any;
  i: any;
  data: any;
  comments: any;
  @Input() chatroomID: string;
  chatroomRef: any;
  uid: any;
  isInstructor: boolean = false;
  items = [];
  username: any;
  comment_votes: Array<any>;

  constructor(public afDB:AngularFireDatabase, public navParams: NavParams, public afAuth: AngularFireAuth ) {
    this.i = 1;
    this.uid = afAuth.auth.currentUser.uid;
    console.log('uid: ' + this.uid);

    this.comment_votes = new Array<any>();
  }
  // //pull from database each time, list?
  // doInfinite(infiniteScroll) {
  //   console.log('Begin async operation');

  //   setTimeout(() => {
  //     for (let i = 0; i < 20; i++) {
  //       this.items.push( this.items.length );
  //     }

  //     console.log('Async operation has ended');
  //     infiniteScroll.complete();
  //   }, 2000);
  // }
  
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
    this.chatroomRef = this.afDB.list('chatrooms/' + this.chatroomID + '/comments', ref=>{
      let q = ref.orderByKey().limitToLast(10);
      let key = ref.endAt(11);
      console.log(key);
      return q;
    });
    this.comments = this.chatroomRef.valueChanges();
    this.chatroomRef.valueChanges().subscribe(data =>{
      for(let comment of data){
        for(let vote_history of comment){
          for(let vote of vote_history){
            if(vote.indexOf(this.uid) != -1){
              console.log(vote)
              this.comment_votes.push({
                commentKey : comment.commentKey,
                vote: vote.value
              });
            }
          }
        }
      }
    });

    this.chatroomRef.valueChanges().subscribe(data=>{
      this.scrollToBottom(); 
      console.log('new message ');
    });

    /**
     * check if the user is an instructor using the userProfile database and the id of the user logged on
     * and change the value of occupation and if it contains 'instructor'.
     * need to add the property manually in firebase. userProfile>[uid]> {occupation: 'instructor'}
     */
    //this.uid = this.navParams.get('uid');
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

  ngOnViewChecked(){
    this.scrollToBottom();
  }

  onScroll(){
    if(this.commentlist.nativeElement.scrollTop === 0){
      console.log('scrolled to top');
    }
  }

  removeComment(event, commentID){
    //console.log(commentID);
    if(this.isInstructor){
      this.afDB.object('chatrooms/' + this.chatroomID + '/comments/' + commentID).remove();
    }
  }

  /**
   * 
   * @param event click event
   * @param commentID comment.commentKey
   * @param commentPoints comment.points
   * @param pointDelta 1 or -1
   */
  vote(event, commentID, commentPoints, pointDelta){
    let voted = false;
    let commentKey = null;
    let newPoints = 0;
    if(this.comment_votes != null){
      for(let voteKey in this.comment_votes){
        console.log("voteKey: " + voteKey + "\ncomment_vote.uid:  " + this.comment_votes[voteKey].uid +
          "\ncurrent_user.uid: " + this.uid + "\ncomment_vote.value: " + this.comment_votes[voteKey].value +
          "\npointDelta: " + pointDelta );
        if(this.comment_votes[voteKey].commentKey == commentID && this.comment_votes[voteKey].value == pointDelta){
          voted = true;
          this.afDB.list('chatrooms/' + this.chatroomID + '/comments/' + commentID + '/vote_history').remove(commentID);
          newPoints = commentPoints + pointDelta * -1;
          let indexOfToRemove = this.comment_votes.indexOf({'commentKey': commentID});
          this.comment_votes.splice(indexOfToRemove, 1);

        }
        else if(this.comment_votes[voteKey].commentKey == commentID && this.comment_votes[voteKey].value != pointDelta){
          voted = true;
          let oldVote = new Vote();
          oldVote.uid = this.uid;
          oldVote.value = pointDelta;
          newPoints = commentPoints + pointDelta * 2;
          this.afDB.list('chatrooms/' + this.chatroomID + '/comments/' + commentID + '/vote_history').update(commentID, oldVote);
          this.comment_votes[voteKey].value = pointDelta;

        }
      }
    }

    if(!voted){
      //console.log(commentID + " " + commentPoints + " " + pointDelta);
      /**
       * calculate new points
       */
      newPoints = commentPoints + pointDelta;

      /**
       * update database
       */

      let newVote = new Vote();
      newVote.uid = this.uid;
      newVote.value = pointDelta;
      this.afDB.list('chatrooms/' + this.chatroomID + '/comments/' + commentID + '/vote_history').push(newVote);

      /**
       * update comments_vote
       */
      this.comment_votes.push({
        commentKey: commentID,
        value: pointDelta
      })
    }

    /**
     * update points
     */
    this.afDB.object('chatrooms/' + this.chatroomID + '/comments/' + commentID).update({
      points: newPoints
    }); 
  }

  /**
   * scroll to bottom
   */
  scrollToBottom(): void{
    try{
      this.commentlist.nativeElement.scrollTop = this.commentlist.nativeElement.scrollHeight;
      console.log('scrolltobottom: ');
    }
    catch(err){
      console.log('did not scrolltobottom: ' + err);
    }
  }
}
