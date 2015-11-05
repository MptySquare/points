Graphs = new Mongo.Collection('graphs');
Tasks = new Mongo.Collection('tasks');
Points = new Mongo.Collection('points');
Trello = new Mongo.Collection('trello');

if (Meteor.isServer){
  Meteor.startup(function(){
    Trello._ensureIndex({id:1},{unique:1});
  });
}
