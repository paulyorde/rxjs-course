import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import { Subject } from 'rxjs';
import { AsyncSubject } from 'rxjs';
import { ReplaySubject } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import {concat, fromEvent, interval, noop, observable, Observable, of, timer, merge} from 'rxjs';
import {delayWhen, filter, map, take, timeout} from 'rxjs/operators';
import {createHttpObservable} from '../common/util';


@Component({
    selector: 'about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

    ngOnInit() {
      const sub = new ReplaySubject()
      const s1$ = sub.asObservable()
      s1$.subscribe(v => console.log('early', v))


      sub.next(1)
      sub.next(2)
      sub.next(3) // latest value of initial emission
      // sub.complete() //
      setTimeout(() => {
        s1$.subscribe(v => console.log('late', v))
        sub.next(4) // initial sub gets latest value from late sub
      }, 3000);

    }


}






