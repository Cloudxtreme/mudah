import angular from 'angular';

const name = 'chatNameFilter';

function ChatNameFilter(chat) {
  if (!chat) return;

  let otherId = _.without(chat.userIds, Meteor.userId())[0];
  let otherUser = Meteor.users.findOne(otherId);
  let hasName = otherUser && otherUser.profile && otherUser.profile.name;

  return hasName ? otherUser.profile.name : chat.name || 'NO NAME';
}

// create a module
export default angular.module(name, [])
  .filter(name, () => {
    return ChatNameFilter;
  });
