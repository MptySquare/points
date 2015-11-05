getCommentActions = ()->
      actions = []
      cards = Trello.find().map( (card)->
        for action in card.actions
          if action.type is "commentCard" and /plus/.test(action.data.text) and moment(action.date) > moment().subtract(24,'hours')
            action.data.pt_s = action.data.text.split(' ')[1].split('/')[0]
            actions.push action
      )
      return actions

Template.trello.helpers(
    timeSpentInDay: ()->
      pts = (parseFloat(action.data.pt_s) for action in getCommentActions())
      sumOpoints = pts.reduce (old,neu) -> old + neu
      return sumOpoints.toFixed(2)

    cardTotals: ()->
      return getCommentActions()

    ptsRevealSettings: ()->
      return fields: [
          key: 'data.pt_s'
          label: 'points'
         ,
          key: 'data.card.name'
          label: 'card'
      ]

    cardsSettings: ()->
      return fields: [
          key: 'data.pt_s'
          label: 'points'
         ,
          key: 'date'
          label: 'date'
         ,
          key: 'data.text'
          label: 'comment'
         ,
          key: 'data.card.name'
          label: 'card'
        ]
)
