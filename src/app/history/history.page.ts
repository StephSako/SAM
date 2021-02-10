import { Component, OnInit } from '@angular/core';
import { CourseInterface } from '../interfaces/CourseInterface'

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {

  courses: CourseInterface[]

  constructor() { }

  ngOnInit() {
    this.courses = [{date: "07/01/21", name: "Jean-Michel Loufard", distance: "4km", time: "3min"},
    {date: "05/01/21", name: "Jean-Michel Loufard", distance: "17km", time: "20min"},
    {date: "04/01/21", name: "Eric Lafleur", distance: "11km", time: "11min"}]
  }

}
