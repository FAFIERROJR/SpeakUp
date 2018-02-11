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
  displayBatch: any;
  batch1: any;
  totalBatch: any;
  a: Observable<{}>;
  thisBatch: any;
  batchA: any;
  knownKey: any;
  knownKeyArray: any[];
  firstKnownKey: any;
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
  comments = [];
  @Input() chatroomID: string;
  chatroomRef: any;
  uid: any;
  isInstructor: boolean = false;
  username: any;

  constructor(public afDB:AngularFireDatabase, public navParams: NavParams, ) {
    this.i = 1;
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
    this.chatroomRef = this.afDB.list('chatrooms/' + this.chatroomID + '/comments');
    this.chatroomRef.valueChanges().subscribe(data=>{
      this.scrollToBottom(); 
      console.log('new message ');
    });
  
    this.knownKeyArray = [];
    let q,k;
    this.chatroomRef = this.afDB.list('chatrooms/' + this.chatroomID + '/comments', ref=>{
      q = ref.orderByKey().limitToLast(10);
      k = ref.orderByKey().limitToLast(11);
      k.once('value', (snapshot)=>{
        snapshot.forEach((childSnapShot): any =>{
          this.knownKey = childSnapShot.key;
          this.knownKeyArray.push(this.knownKey);
        })
        this.firstKnownKey = this.knownKeyArray[0];
          console.log(this.firstKnownKey);
      })
      return q;
    });
    this.batchA = this.chatroomRef.valueChanges();
    this.batchA.subscribe(data=>{
      this.comments = data;
      console.log("onInit display:", this.comments);
    });
    

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

  getComments(storedKey,lastKey, oldBatch){
    console.log("oldbatch ",oldBatch);
    let q,k;
    let Aarr;
    this.knownKeyArray = [];
    this.chatroomRef = this.afDB.list('chatrooms/' + this.chatroomID + '/comments', ref=>{
      q = ref.orderByKey().endAt(storedKey).limitToLast(10);
      k = ref.orderByKey().endAt(storedKey).limitToLast(11);  
      k.once('value', (snapshot)=>{
        snapshot.forEach((childSnapShot): any =>{
          this.knownKey = childSnapShot.key;
          this.knownKeyArray.push(this.knownKey);
        })
        this.firstKnownKey = this.knownKeyArray[0];
        console.log(this.firstKnownKey);
      })
      return q;
    });

    this.chatroomRef.valueChanges().subscribe(nextBatch =>{
      console.log("next batch", nextBatch);
      if(this.firstKnownKey === lastKey){
        console.log('end');
      }
      else{
        this.comments = Array.prototype.concat(nextBatch, oldBatch);
        this.commentlist.nativeElement.scrollTop = (this.commentlist.nativeElement.scrollHeight)* 0.20 ;   
      }
    });
  }

onScroll(){
    if(this.commentlist.nativeElement.scrollTop === 0){
      console.log('scrolled to top');
      this.getComments(this.firstKnownKey, this.firstKnownKey,this.comments);
    }
  }
  
  ngOnViewChecked(){
    this.scrollToBottom();
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
