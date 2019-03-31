import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { IAppState } from './store';
import { timeSlots } from './timeslots';
import { ADD_EVENT, REMOVE_EVENT, EDIT_EVENT } from './actions';
import { Event } from './event';
import { AlertService } from './alert/alert.service';
import { Messages } from './messages';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  @select() events;
  @select() lastUpdate;
  timeSlots = timeSlots;
  timeSlotContainer: HTMLElement;
  showCreatePopup = false;
  messages = Messages;
  eventObj: Event = {
    'id': 0,
    'label': '',
    'startTime': '',
    'endTime': '',
    'startTimeinMin': 0,
    'endTimeinMin': 0,
    'top': '',
    'height': '',
    'width': '',
    'left': ''
  };
  totalHeight: number;
  totalMinutes = 1440;
  isEditEnable = false;
  constructor(private ngRedux: NgRedux<IAppState>, private alert: AlertService) {
  }
  ngOnInit() {
  }
  ngAfterViewInit() {
    this.timeSlotContainer = document.getElementById('timeSlotContainer');
    this.totalHeight = this.timeSlotContainer.offsetHeight;
  }
  addEvent(): void {
    const eventObj = this.eventObj;
    if (eventObj.label === '') {
      this.alert.show('', this.messages.noLabel, 'warning');
      return;
    } else if (eventObj.startTime === '' || eventObj.endTime === '') {
      this.alert.show('', this.messages.noStartEndTime, 'warning');
      return;
    }
    const startTime = eventObj.startTime.split(':');
    const startTimeinMinutes = Number(startTime[0]) * 60 + Number(startTime[1]);
    const endTime = eventObj.endTime.split(':');
    const endTimeinMinutes = Number(endTime[0]) * 60 + Number(endTime[1]);
    if (startTimeinMinutes > endTimeinMinutes) {
      this.alert.show('', this.messages.startEndTime, 'error');
      return;
    }
    let width, left;
    if (!this.isEditEnable) {
      width = 100 / (this.isOverlappingEvent(startTimeinMinutes, endTimeinMinutes) + 1);
      left = 100 - width;
    } else {
      width = Number(eventObj.width.split('%')[0]);
      left = Number(eventObj.left.split('%')[0]);
    }
    const evObj = {
      'id': eventObj.id,
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
    if (this.isEditEnable) {
      this.ngRedux.dispatch({type: EDIT_EVENT, event: evObj});
    } else {
      this.ngRedux.dispatch({type: ADD_EVENT, event: evObj});
    }
    this.resetEventObj();
    this.hideEventPopup();
    this.isEditEnable = false;
  }
  isOverlappingEvent(startTime, endTime): number {
    const events = this.ngRedux.getState().events;
    const elems = events.filter(data =>
      (startTime > data.startTimeinMin && startTime < data.endTimeinMin) ||
      (endTime > data.startTimeinMin && endTime < data.endTimeinMin)
    );
    return elems.length;
  }
  editEvent(event: Event): void {
    this.isEditEnable = true;
    this.eventObj = event;
    this.showAddEventPopup();
  }
  showAddEventPopup(): void {
    this.showCreatePopup = true;
  }
  hideEventPopup(): void {
    this.showCreatePopup = false;
  }
  closeEventPopup(): void {
    this.hideEventPopup();
    this.resetEventObj();
  }
  resetEventObj(): void {
    this.eventObj = {
      'id': 0,
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
  addEventElement(eventObj: any): void {
    const divElement = document.createElement('div');
    divElement.style.backgroundColor = 'grey';
    divElement.style.position = 'absolute';
    divElement.style.width = '100%';
    divElement.style.top = eventObj.startTime * (this.totalHeight / this.totalMinutes) + 'px';
    divElement.style.height = (eventObj.endTime - eventObj.startTime) * (this.totalHeight / this.totalMinutes) + 'px';
    this.timeSlotContainer.appendChild(divElement);
  }
}
