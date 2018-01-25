import { Component } from '@angular/core';
import { Keyboard } from 'ionic-angular/platform/keyboard';

@Component({
  selector: 'page-testing',
  templateUrl: 'testing.html'
})
export class TestingPage {
  constructor() {

  }

  onEnterFunction(evt: KeyboardEvent){
    if(evt.code === 'Enter'){
      console.log('hello');
    }
  }
}

