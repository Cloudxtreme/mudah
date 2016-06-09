import angular from 'angular';
import _ from 'underscore';

const name = 'uninvitedFilter';

function UninvitedFilter(users, task) {
  if (!task) {
    return false;
  }

  return users.filter((user) => {
    // if not the creator and not invited
    return user._id !== task.creator && !_.contains(task.invited, user._id);
  });
}

// create a module
export default angular.module(name, [])
  .filter(name, () => {
    return UninvitedFilter;
  });
