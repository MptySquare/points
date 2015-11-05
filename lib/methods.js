Meteor.methods({
  
  resetTrello: function() {
    Trello.remove({});
  },
  insertTrello: function(obj) {
    Trello.update({id:obj.id}, obj, {upsert:true});
  },
  insertExpense: function(obj) {
    Expenses.insert(obj, function(err, results) {
    if (err) {
        console.log(err);
      } else {
        console.log(results);
      }
      return true;
    });
  },
  addTask: function (text) {
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Tasks.insert({
      text: text,
      createdAt: new Date(),
      description: 'hello world',
      points: 1
      //owner: Meteor.userId(),
      //username: Meteor.user().username
    });
  },
  updateTask: function (taskId, details) {
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Tasks.update(taskId, {$set: details});
  },
  deleteTask: function (taskId) {
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Tasks.remove(taskId);
  },
  setChecked: function (taskId, setChecked) {
    var task = Tasks.findOne(taskId)
    if (task.private && task.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
    Tasks.update(taskId, { $set: { checked: setChecked} });
  },
  setPrivate: function (taskId, setPrivate) {
    var task = Tasks.findOne(taskId);
    
    //Privacy control
    if (task.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Tasks.update(taskId, { $set: { private: setPrivate} })
  },
  addPoint: function (taskId) {
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    var task = Tasks.findOne(taskId);

    Points.insert({
      createdAt: new Date(),
      taskId: taskId,
      task: task.text,
      owner: Meteor.userId(),
      username: Meteor.user().username,
      value: task.points
    });
  },
  resetTasks: function () {
    Tasks.remove({});
  },
  resetPoints: function () {
    Points.remove({});
  },
  updatePoint: function(id, details) {
    Points.update({_id:id}, {$set: details});
  },
  deletePoint: function(id) {
    Points.remove({_id:id});
  }
});
