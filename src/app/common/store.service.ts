import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable} from "rxjs";
import { catchError, delay, delayWhen, finalize, map, retryWhen, shareReplay, tap, filter } from 'rxjs/operators';

import { Course } from "../model/course";
import {createHttpObservable} from '../common/util';
import { fromPromise } from "rxjs/internal-compatibility";


@Injectable({
  providedIn: 'root'
})
export class Store {
  private courseObserver = new BehaviorSubject(<Course[]>([]))
  courses$: Observable<Course[]> = this.courseObserver.asObservable()

  init() {
    const http$ = createHttpObservable('/api/courses');

    http$
      .pipe(
          map(res => Object.values(res["payload"]) )
      )
      .subscribe(
        courses => this.courseObserver.next(courses)
      )
  }

  selectBeinngerCourses() {
    return this.filterByCategory('BEGINNER')
  }

  selectAdvancedCourses() {
    return this.filterByCategory('ADVANCED')
  }

  selectCourseById(courseId:number) {
    return this.courses$
    .pipe(
        map(courses => courses
            .find(course => course.id == courseId)),
            filter(course => !!course)
    );
  }

  filterByCategory(category: string) {
    return this.courses$
      .pipe(
          map(courses => courses
              .filter(course => course.category == category))
      );
  }

  saveCourse(courseId:number, changes): Observable<any> {
    // save to store and broadcast optimistically
    const courses = this.courseObserver.getValue()
    const courseIndex = courses.findIndex(course => course.id == courseId)

    const newCourses = courses.slice(0)
    newCourses[courseIndex] = {
      ...courses[courseIndex],
      ...changes
    }

    this.courseObserver.next(newCourses)
    // call backend
    return fromPromise(fetch(`api/courses/${courseId}`, {
      method: 'PUT',
      body: JSON.stringify(changes),
      headers: {
        'content-type': 'application/json'
      }
    }))

  }


}
