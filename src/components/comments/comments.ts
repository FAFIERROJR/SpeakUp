import { Component, Input, ViewChild, ViewChildren, ElementRef } from '@angular/core';
import {AngularFireDatabase, AngularFireObject, AngularFireList} from 'angularfire2/database';
import {Subscription} from 'rxjs';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { query } from '@angular/core/src/animation/dsl';
import { Element } from '@angular/compiler';
import { merge } from 'rxjs/operator/merge';
import * as _ from 'lodash';
import {Observable} from 'rxjs/Rx'
import { of } from 'rxjs/observable/of';
import { concat } from 'rxjs/observable/concat';
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { map } from 'rxjs/operator/map';
import {AngularFireAuth} from 'angularfire2/auth'
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
  newcomments: any;
  comments_temp: any[];
  temp = [];
  newBatch = [];
  alpha = [];
  chatroomRefA: AngularFireList<{}>;
  databaselength: number;
  chatroomComments: number;
  onInitBatch: any;
  knownKey: any;
  knownKeyArray: any[];
  firstKnownKey: any;
  userOccupation: Subscription;
  checkOccupation: AngularFireList<{}>;
  newPoints: any;
  commentPoints: any;
  commentID: any;
  data: any;
  comments = [];
  @Input() chatroomID: string;
  chatroomRef: any;
  uid: any;
  isInstructor: boolean = false;
  username: any;
  retrievable: boolean = false;
  @ViewChild('commentlist') private commentlist: ElementRef;
  pointsElementTextContent: string;
  items = [];
  comment_votes: Array<any>;


  constructor(public afDB:AngularFireDatabase, public navParams: NavParams, public afAuth: AngularFireAuth ) {
    this.chatroomID = this.navParams.get('chatroomID');
    this.uid = afAuth.auth.currentUser.uid;
    console.log('uid: ' + this.uid);

    this.comment_votes = new Array<any>();
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
    /**
     * Vote History
     */
    this.chatroomRef = this.afDB.list('chatrooms/' + this.chatroomID + '/comments');
    this.chatroomRef.valueChanges().subscribe(data =>{
      for(let comment of data){
        console.log('comment: ' + comment);
        for(let vote_history of comment){
          console.log('vote_history:' + vote_history);
          for(let vote of vote_history){
            console.log(vote)
            if(vote.indexOf(this.uid) != -1){
              this.comment_votes.push({
                vid: vote.vid,
                commentKey : comment.commentKey,
                vote: vote.value
              });
            }
          }
        }
      }
      console.log('initial comment_votes: ' + this.comment_votes);
    });

    /**
     * Infinite
     */
    this.checkDataBaseInfo();
    this.knownKeyArray = [];//empty array to store keys 
    let q,k;
    this.chatroomRefA = this.afDB.list('chatrooms/' + this.chatroomID + '/comments', ref=>{
      q = ref.orderByKey().limitToLast(10);//get the very last 10 query in the database
      k = ref.orderByKey().limitToLast(11);//create another query with an extra key, this will be use for the next query
      k.once('value', (snapshot)=>{
        snapshot.forEach((childSnapShot): any =>{
          this.knownKey = childSnapShot.key;
          this.knownKeyArray.push(this.knownKey);
        })
        this.firstKnownKey = this.knownKeyArray[0];//first known key to saved for the first scrolling
      })
      return q;
    });
    //this is fired off multiple times, why? 
    this.chatroomRefA.valueChanges().subscribe(data=>{ //subscribe; the data becomes an array
      if(this.comments.length === 0){
        this.comments = data;
        console.log('comments array empty');
      }
      else{
        this.temp = [];
        this.afDB.list('chatrooms/' + this.chatroomID + '/comments', ref=>{
          let a = ref.limitToLast(1);//get the very last 10 query in the database
          a.once('value', (snapshot)=>{
            snapshot.forEach((childSnapShot): any =>{
              this.temp.push(childSnapShot.val());
            })
          })
          return a;
        });
        this.comments_temp = Array.prototype.concat(this.comments, this.temp);
        /**
         * not sure why its being duplicated, but made method to remove the duplicates comments with the same keys
         */
        this.comments = this.removeDuplicates(this.comments_temp, "commentKey");
        console.log(this.comments);
      }
    });
    /**
     * check if the user is an instructor using the userProfile database and the id of the user logged on
     * and change the value of occupation and if it contains 'instructor'.
     * need to add the property manually in firebase. userProfile>[uid]> {occupation: 'instructor'}
     */
    this.uid = this.navParams.get('uid');
    //console.log('chatroom: ' + this.uid);
    this.userOccupation = this.afDB.list('userProfile/' + this.uid).valueChanges().subscribe(data=>{
      if(data.indexOf('instructor') != -1){
        //console.log(data.indexOf('instructor') + ' is instructor');
        this.isInstructor = true; 
            
      }
      else{   
        //console.log(data.indexOf('instructor') + ' not instructor');
        this.isInstructor = false;
      }
    });
  }
  /**
   * remove any duplicates comments with the same key
   * @param mArray the array of comments to be run though
   * @param index  the index of the objects in the array
   */
  removeDuplicates(mArray, index) {
      let newArray = [];
      let objects  = {};
      let items;
      for(items in mArray) {
        objects[mArray[items][index]] = mArray[items];
      }

      for(items in objects) {
          newArray.push(objects[items]);
      }
      console.log('removeDuplicates');
      return newArray;
  }
  
  checkDataBaseInfo(){
    this.afDB.list('chatrooms/' + this.chatroomID + '/comments')
      .valueChanges()
      .subscribe((data:any[])=>{
      if(data.length >= 11){
        this.retrievable = true;
      }
      this.databaselength = data.length;
    });
  }
  
  /**
   * retreive comments from database by query. 
   * ordering by key, stopping at the storedkey, and retreive only the lasts 'n' comments
   * @param storedKey the firstknownkey becomes the store key
   * @param oldBatch the batch that was displayed
   */
  getComments(storedKey, oldBatch){
    try{
      let q,k,m; //query items      
      this.knownKeyArray = [];//initailize empty array to store the comment keys

      /**Mainly used for when a new chatroom is created for the first time and new comments are added and scroll has not been added */
      if(storedKey === undefined || storedKey === null){
        this.afDB.list('chatrooms/' + this.chatroomID + '/comments', ref=>{
          m = ref.orderByKey().limitToLast(11);//create another query with an extra key, this will be use for the next query
          m.once('value', (snapshot)=>{
            snapshot.forEach((childSnapShot): any =>{
            this.knownKey = childSnapShot.key;
            this.knownKeyArray.push(this.knownKey);
          })
            storedKey = this.knownKeyArray[0];//first known key to saved for the first scrolling
            console.log('storedkey2',storedKey);
          })
          return m
        });
      }

      if(this.retrievable){
        let newBatch = [];
        this.chatroomRef = this.afDB.list('chatrooms/' + this.chatroomID + '/comments', ref=>{
          q = ref.orderByKey().endAt(storedKey).limitToLast(10);
          q.once('value', (snapshot)=>{
            snapshot.forEach((childSnapShot): any =>{
              newBatch.push(childSnapShot.val());
              // console.log('childss: ', JSON.stringify(childSnapShot))
            })
          })
          this.comments = Array.prototype.concat(newBatch, oldBatch);
          console.log('comments array: ', this.comments);
        
          /**
           * get the snapshot data, and only get the key of the data.
           * add them to the array of keys
           */ 
          k = ref.orderByKey().endAt(storedKey).limitToLast(11);          
          k.once('value', (snapshot)=>{
            snapshot.forEach((childSnapShot): any =>{
              this.knownKey = childSnapShot.key;
              this.knownKeyArray.push(this.knownKey);
              // console.log('childss: ', JSON.stringify(childSnapShot))
            })
            this.firstKnownKey = this.knownKeyArray[0];//this will be the next known key use for the next query
          })
          
          return k;//return the query
        }); 
        // if the firstknownkey matches the nextbatch's first key, that means we've retrieved everything from the database
        if(this.comments.length === this.databaselength){
          console.log('end');
          this.retrievable = false;
        }
        else{
          this.retrievable = true;
          console.log('firstknownkey', this.firstKnownKey);
        }
      }

      // /**
      //  * if there is still something in the database, then continue to retrieve
      //  */
      // if(this.retrievable){
      //   this.chatroomRef.valueChanges().subscribe(nextBatch =>{
      //     //concatinate the nextbatch onto of the old batch, and show it in the comments
      //     this.comments = Array.prototype.concat(nextBatch, oldBatch);
      //     //mapping the commentkeys to compare them to each other to know when the end of the database is   
      //     let mapNextBatch = nextBatch.map(array => array.commentKey);  
      //     // if the firstknownkey matches the nextbatch's first key, that means we've retrieved everything from the database
      //     if(this.comments.length === this.databaselength){
      //       console.log('end');
      //       this.retrievable = false;
      //     }
      //     else{
      //       this.retrievable = true;
      //       console.log('firstknownkey', this.firstKnownKey);
      //     }
      //   });
      // }
    }catch(err){
      console.log(err);
    }
  }

  doInfinite(infiniteScroll){ 
    setTimeout(()=>{
      this.getComments(this.firstKnownKey, this.comments);
      infiniteScroll.complete();
    }, 800);
  }

  /**
   * remove the comment if it is an instructor
   * @param event click
   * @param commentID commentkey id
   */
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
      console.log(this.comment_votes);
      for(let voteKey in this.comment_votes){
        // console.log("commentID" + commentID + "voteKey: " + voteKey + "\ncomment_vote.commentKey:  " + this.comment_votes[voteKey].commentKey+
        //   "\ncurrent_user.uid: " + this.uid + "\ncomment_vote.value: " + this.comment_votes[voteKey].value +
        //   "\npointDelta: " + pointDelta );
        if(this.comment_votes[voteKey].commentKey == commentID && this.comment_votes[voteKey].value == pointDelta){
          voted = true;
          this.afDB.list('chatrooms/' + this.chatroomID + '/comments/' + commentID + '/vote_history').remove(this.comment_votes[voteKey].vid);
          newPoints = commentPoints + pointDelta * -1;
          let indexOfToRemove = this.comment_votes.indexOf({commentKey: commentID, value: pointDelta}, 0);
          console.log('indexOfToRemove: ' + indexOfToRemove);
          this.comment_votes.splice(indexOfToRemove, 1);

        }
        else if(this.comment_votes[voteKey].commentKey == commentID && this.comment_votes[voteKey].value != pointDelta){
          voted = true;
          let oldVote = new Vote();
          oldVote.uid = this.uid;
          oldVote.value = pointDelta;
          newPoints = commentPoints + pointDelta * 2;
          this.afDB.list('chatrooms/' + this.chatroomID + '/comments/' + commentID + '/vote_history').update(this.comment_votes[voteKey].vid, oldVote);
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
      let vote_id = this.afDB.list('chatrooms/' + this.chatroomID + '/comments/' + commentID + '/vote_history').push(newVote).key;
      this.afDB.list('chatrooms/' + this.chatroomID + '/comments/' + commentID + '/vote_history/').update(vote_id, {vid: vote_id });

      /**
       * update comments_vote
       */
      this.comment_votes.push({
        vid: vote_id,
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

  detBtnColor(vote_history: Array<any> , btnValue){
    //console.log(vote_history);
    if(vote_history != null){
      let commentValue = null
      for(let vote_key in vote_history){
        if(vote_history[vote_key].uid == this.uid ){
          commentValue = vote_history[vote_key].value;
        }
      }
      //console.log('commentValue: ' + commentValue + ' bntValue: ' + btnValue);
      if(commentValue != null){
        if(btnValue == 1 && commentValue == 1){
        return 'orange';
        }
        else if(btnValue == -1 && commentValue == -1){
          return 'purple';
        }
      }
    }
    else{
      return 'white';
    }
  }
}
