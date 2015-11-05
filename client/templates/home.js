
  Template.home.onRendered(function() {
    this.$('ul.tabs').tabs();
    this.$('.modal-trigger').leanModal();
    /*this.$('.datepicker').pickadate({
      selectMonths: true
    });*/
  });

  // This code only runs on the client
  Template.enterTasks.helpers({
    tasks: function() {
      if (Session.get("hideCompleted")) {
        // If hide completed is checked, filter tasks
        return Tasks.find({checked: {$ne: true}}, {sort: {createdAt: -1}});
      } else {
        // Otherwise, return all of the tasks
        return Tasks.find({}, {sort: {createdAt: -1}});
      }
    }
  });
  Template.home.helpers({
    hideCompleted: function () {
      return Session.get("hideCompleted");
    },
    incompleteCount: function () {
      return Tasks.find({checked: {$ne:true}}).count();
    },
    totalPoints: function() {
      var total = 0;
      Points.find({owner: Meteor.userId()}).map(function(pt) {
        total += pt.value;
      });
      return total;
    }
  });

  Template.listPoints.events({
    'click .modal-trigger': function(e) {
      var pt = Points.findOne({_id:this._id});
      Session.set('editPoint', pt);
    }
  });

  Template.editPointForm.helpers({
    taskName: function(){ 
      return Session.get('editPoint').task;
    },
    ptval: function(){
      return Session.get('editPoint').value;
    },
    pttime: function () {
      return Session.get('editPoint').createdAt.toTimeString().split(' ')[0];
    },
    ptdate: function () {
      return Session.get('editPoint').createdAt.toISOString().split('T')[0];
    }
  });

  Template.editPointForm.events({
    'submit form': function (e) {
      e.preventDefault();
      var tar = e.target;
      var details = {}
      details.value = parseFloat($(tar).find('#ptval').val());
      date = $(tar).find('#date').val().split('-').map(function (x) {return parseInt(x);});
      time = $(tar).find('#time').val().split(':').map(function (x) {return parseInt(x);});
      details.createdAt = new Date(date[0], date[1]-1, date[2], time[0], time[1], time[2]);
      Meteor.call('updatePoint', Session.get('editPoint')._id, details);
      return false;
    },
    'click #deletePt': function () {
      if (confirm('Are you sure you want to delete this point?')) {
        Meteor.call('deletePoint', Session.get('editPoint')._id);
        $('.lean-overlay').click();
      }
    }
  });

  Template.listPoints.helpers({
    points: function () {
      return Points.find({});
    },
    tableSettings: function () {
      return {
        fields: [
          {key: 'createdAt', label: 'Date', sortDirection: 'descending',
          fn: function (val, obj) {
            return val.toDateString();
          }},
          {key: 'createdAt', label: 'Time', fn: function (val, obj) {
            return val.toLocaleTimeString();
          }},
          {key: 'task', label: 'Task', tmpl: Template.pointListTask},
          {key: 'value', label: 'Pts'},
          {key: 'username', label: 'Player'}
        ]
      };
    }
  });

  //Task Template helpers
  Template.task.helpers({
    isOwner: function () {
      return this.owner === Meteor.userId();
    }
  });

  Template.task.events({
    'submit form': function(event) {
      event.preventDefault();
      var tar = event.target;
      var details = {}
      details.text = $(tar).find('#taskName')[0].value;
      details.description = $(tar).find('#description')[0].value;
      details.points = parseFloat($(tar).find('#points')[0].value);
      Meteor.call('updateTask', this._id, details);
      return false;
    },
    'click .toggle-private': function () {
      Meteor.call('setPrivate', this._id, !this.private);
    },
    'click .add-point': function () {
      Meteor.call('addPoint', this._id);
    },
    'focus .task': function (ev) {
      event.preventDefault();
      var tar = $(ev.target).parent().siblings('.details');
      var siblings = tar.parent().parent().siblings().children('.task-form').children('.details');
      $(siblings).each(function() {
        if ( !$(this).hasClass('hide') ) {
          $(this).addClass('hide');
        }
      });
      if ( tar.hasClass('hide') ) {
        tar.removeClass('hide');
      }     
    }
  });


  //Events
  Template.appBody.events({
  });
  
  Template.home.events({
    "click .toggle-checked": function () {
      // Set the checked property to the opposite of its current value
      Meteor.call('setChecked', this._id, !this.checked);
    },
    "click .deleteTask": function () {
      Meteor.call('deleteTask', this._id);
    },
    "change .hide-completed input": function (event) {
      Session.set("hideCompleted", event.target.checked);
    },
    'submit .new-task': function(event) {
      var text = event.target.text.value;
      Meteor.call('addTask', text);
      event.target.text.value = "";
      return false;
    },
    'focus .new-task': function () {
      console.log('focuse new task');
      $('.details').each( function() {
        if ( !$(this).hasClass('hide') ) {
          $(this).addClass('hide');
        }
      });
    }
  });

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
