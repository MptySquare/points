
  Meteor.publish("tasks", function () {
    return Tasks.find({
      $or: [
        { private: {$ne: true} },
        { owner: this.userId }
      ]
    });
  });

  Meteor.publish('graphs', function() {
    return Graphs.find({});
  });

  Meteor.publish('expenses', function() {
    return Expenses.find({});
  });

  Meteor.publish('points', function() {
    return Points.find({});
  });

  Meteor.publish('trello', function(){
    return Trello.find({});
  });
