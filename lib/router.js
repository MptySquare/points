Router.configure({
  layoutTemplate: 'appBody',
  waitOn: function() {
    return [
      Meteor.subscribe('tasks'),
      Meteor.subscribe('points'),
      Meteor.subscribe('graphs'),
      Meteor.subscribe('expenses'),
      Meteor.subscribe('trello')
    ];
  }
});

Router.map(function() {
  this.route('home', {
    path: '/'
  });
  this.route('leaderboard');
  this.route('template');
  this.route('pts');
  this.route('stats');
  this.route('d3', {
    path: 'dashboard'
  });
});
