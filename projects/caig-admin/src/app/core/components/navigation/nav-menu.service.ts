import {Injectable} from '@angular/core';
import {Portal} from '../../../models/session.model';
import {NavMenuItem} from './navigation.component';

@Injectable()
export class NavMenuService {
  public build(portal?: Portal): NavMenuItem[] {
    switch (portal) {
      case Portal.CallCenter:
        return [
          callList,
          events
        ];
      case Portal.CAIG:
        return [
          employees,
          events,
          payrolls,
          // {
          //   name: 'Agencies',
          //   icon: 'business',
          //   route: '/agencies',
          // },
          // {
          //   name: 'Tasks',
          //   icon: 'assignment',
          //   route: '/tasks',
          // },
          // {
          //   name: 'Contact Center',
          //   icon: 'contact_phone',
          //   route: 'contact-center',
          // },
          // surveys,
        ];
      case Portal.Survey:
        return [
          employees,
          surveys,
        ];
      default:
        return [];
    }
  }
}

const callList = {
  name: 'Call List',
  icon: 'contact_phone',
  route: 'call-list',
};

const events = {
  name: 'Events',
  icon: 'receipt_long',
  route: 'events',
};

const employees = {
  name: 'Employees',
  icon : 'badge',
  route : '/employees'
};

const surveys = {
  name: 'Surveys',
  icon: 'quiz',
  route: 'surveys',
};

const payrolls = {
  name: 'Payrolls',
  icon: 'payments',
  route: 'payrolls',
};
