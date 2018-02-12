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
  databaselength: number;
  chatroomComments: number;
  batchA: any;
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

  constructor(public afDB:AngularFireDatabase, public navParams: NavParams, ) {
    this.chatroomID = this.navParams.get('chatroomID');
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
    this.checkDataBaseInfo();
    this.knownKeyArray = [];//empty array to store keys 
    let q,k;
    this.chatroomRef = this.afDB.list('chatrooms/' + this.chatroomID + '/comments', ref=>{
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
    
    this.batchA = this.chatroomRef.valueChanges();
    this.batchA.subscribe((data: any[])=>{ //subscribe; the data becomes an array
      this.comments = data;
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

  checkDataBaseInfo(){
    let i;
    let chatRef = this.afDB.list('chatrooms/' + this.chatroomID + '/comments').valueChanges();
    chatRef.subscribe((data:any[])=>{
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

      this.chatroomRef = this.afDB.list('chatrooms/' + this.chatroomID + '/comments', ref=>{
        q = ref.orderByKey().endAt(storedKey).limitToLast(10);
        k = ref.orderByKey().endAt(storedKey).limitToLast(11); 
        /**
         * get the snapshot data, and only get the key of the data.
         * add them to the array of keys
         */ 
        k.once('value', (snapshot)=>{
          snapshot.forEach((childSnapShot): any =>{
            this.knownKey = childSnapShot.key;
            this.knownKeyArray.push(this.knownKey);
          })
          this.firstKnownKey = this.knownKeyArray[0];//this will be the next known key use for the next query
        })
        return q;//return the query
      });

      /**
       * if there is still something in the database, then continue to retrieve
       */
      if(this.retrievable){
        this.chatroomRef.valueChanges().subscribe(nextBatch =>{
          //concatinate the nextbatch onto of the old batch, and show it in the comments
          this.comments = Array.prototype.concat(nextBatch, oldBatch);
          //mapping the commentkeys to compare them to each other to know when the end of the database is   
          let mapNextBatch = nextBatch.map(array => array.commentKey);  
          // if the firstknownkey matches the nextbatch's first key, that means we've retrieved everything from the database
          if(this.comments.length === this.databaselength){
            console.log('end');
            this.retrievable = false;
          }
          else{
            this.retrievable = true;
            console.log('firstknownkey', this.firstKnownKey);
          }
        });
      }
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
