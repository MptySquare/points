Template.leaderboard.helpers(
    playerTotals: ()->
      players = {}
      assignPoints = (player, pt)->
        today = new Date()
        stamp =
          date: (date)->
            return this.month(date) + date.getDate()
          week: (date)->
            return date.getDay() > date.getDate() ? this.month(date)+0 : this.month(date) + date.getDate() - date.getDay()
          month: (date)->
            return date.getYear()*10000 + date.getMonth()*100
      
        player.totalTotal += pt.value
        player.todayTotal += if stamp.date(today) is stamp.date(pt.createdAt) then pt.value else 0
        player.weekTotal += if stamp.week(today) is stamp.week(pt.createdAt) then pt.value else 0
        player.monthTotal += if stamp.month(today) is stamp.month(pt.createdAt) then pt.value else 0

        return player

      Points.find({}).map((pt)->
        if !players[pt.username]
        #Init the player totals obj
          players[pt.username] =
            name: pt.username
            todayTotal: 0
            weekTotal: 0
            monthTotal: 0
            totalTotal: 0

        players[pt.username] = assignPoints(players[pt.username], pt)
      )

      playersResult = []
      for player in players
        playersResult.push(players[player])

      return playersResult

    totalsSettings: ()->
      return fields: [
          {key: 'name', label: 'Player'},
          {key: 'todayTotal', label: 'Today'},
          {key: 'weekTotal', label: 'Week'},
          {key: 'monthTotal', label: 'Month'},
          {key: 'totalTotal', label: 'All time'}
        ]
)
