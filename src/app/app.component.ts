import { Component, OnInit, AfterViewInit } from '@angular/core';
import { timeSlots } from './timeslots';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'app';
  timeSlots = timeSlots;
  timeSlotContainer: HTMLElement;
  showCreatePopup = false;
  eventObj: any = {
    'label': '',
    'startTime': '',
    'endTime': '',
    'startTimeinMin': 0,
    'endTimeinMin': 0,
    'top': '0px',
    'height': '',
    'width': '',
    'left': ''
  };
  eventsInput = [];
  totalHeight: number;
  totalMinutes = 1440;
  isEditEnable = false;
  constructor() {
  }
  ngOnInit() {

  }
  ngAfterViewInit() {
    this.timeSlotContainer = document.getElementById('timeSlotContainer');
    this.totalHeight = this.timeSlotContainer.offsetHeight;
    console.log(this.totalHeight);
  }
  addEvent() {
    const eventObj = this.eventObj;
    const startTime = eventObj.startTime.split(':');
    const startTimeinMinutes = Number(startTime[0]) * 60 + Number(startTime[1]);
    const endTime = eventObj.endTime.split(':');
    const endTimeinMinutes = Number(endTime[0]) * 60 + Number(endTime[1]);
    let width, left;
    if (!this.isEditEnable) {
      width = 100 / (this.isOverlappingEvent(startTimeinMinutes, endTimeinMinutes) + 1);
      left = 100 - width;
    } else {
      width = Number(eventObj.width.split('%')[0]);
      left = Number(eventObj.left.split('%')[0]);
    }
    const evObj = {
      'label': eventObj.label,
      'startTime': eventObj.startTime,
      'endTime': eventObj.endTime,
      'startTimeinMin': startTimeinMinutes,
      'endTimeinMin': endTimeinMinutes,
      'top': startTimeinMinutes * (this.totalHeight / this.totalMinutes) + 'px',
      'height': (endTimeinMinutes - startTimeinMinutes) * (this.totalHeight / this.totalMinutes) + 'px',
      'width': width + '%',
      'left': left + '%'
    };
    this.eventsInput.push(Object.assign({}, evObj));
    this.resetEventObj();
    this.hideEventPopup();
  }
  isOverlappingEvent(startTime, endTime) {
    const elems = this.eventsInput.filter(data =>
      (startTime > data.startTimeinMin && startTime < data.endTimeinMin ) ||
      (endTime > data.startTimeinMin && endTime < data.endTimeinMin)
    );
    return elems.length;
  }
  editEvent(index: number) {
    this.isEditEnable = true;
    this.eventObj = this.eventsInput.splice(index, 1)[0];
    this.showAddEventPopup();
  }
  showAddEventPopup() {
    this.showCreatePopup = true;
  }
  hideEventPopup() {
    this.showCreatePopup = false;
  }
  resetEventObj() {
    this.eventObj = {
      'label': '',
      'startTime': '',
      'endTime': '',
      'startTimeinMin': 0,
      'endTimeinMin': 0,
      'top': '0px',
      'height': '',
      'width': '',
      'left': ''
    };
  }
  addEventElement(eventObj: any) {
    const divElement = document.createElement('div');
    divElement.style.backgroundColor = 'grey';
    divElement.style.position = 'absolute';
    divElement.style.width = '100%';
    divElement.style.top = eventObj.startTime * (this.totalHeight / this.totalMinutes) + 'px';
    divElement.style.height = (eventObj.endTime - eventObj.startTime) * (this.totalHeight / this.totalMinutes) + 'px';
    this.timeSlotContainer.appendChild(divElement);
  }
}
