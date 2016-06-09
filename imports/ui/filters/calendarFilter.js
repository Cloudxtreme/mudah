import angular from 'angular';
import moment from 'moment';

const name = 'calendarFilter';

function CalendarFilter(time) {
  if (!time) return;

  return moment(time).calendar(null, {
    lastDay : '[Yesterday]',
    sameDay : 'LT',
    lastWeek : 'dddd',
    sameElse : 'DD/MM/YY'
  });
}

// create a module
export default angular.module(name, [])
  .filter(name, () => {
    return CalendarFilter;
  });
