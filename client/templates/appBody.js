  Template.appBody.helpers({
    totalPoints: function() {
      var total = 0;
      Points.find({owner: Meteor.userId()}).map(function(pt) {
        total += pt.value;
      });
      return total;
    }
  });

  Template.appBody.onRendered(function() {
    this.$('.button-collapse').sideNav();
  });

