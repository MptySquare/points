Template.stats.onRendered( ()->
)

Template.stats.helpers(
  allCount: ()->
    return (card.name for card in Trello.find().fetch() when moment(card.dateLastActivity) > moment().subtract(24, 'hours') )
  donePerDay: ()->
    return (card for card in Trello.find().fetch() when moment(card.dateLastActivity) > moment().subtract(24, 'hours') ).length
  daysCategories: ()->
    return (label.name for label in card.labels for card in Trello.find().fetch() when moment(card.dateLastActivity) > moment().subtract(24, 'hours') )
)

Template.stats.events(
  "submit #insertTrello": (e)->
    e.preventDefault()
    Meteor.call('insertTrello', JSON.parse($('#insertTrello textarea').val()) )
    $('#insertTrello textarea').val('')
)
