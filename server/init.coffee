Meteor.startup( ()->
  #process.env.MONGO_URL =  "mongodb://mauro:Shoez117@candidate.53.mongolayer.com:10076/points"

  fs = Npm.require('fs')

  cardDir = "./assets/app/cards/"
  #console.log fs.readdirSync(cardDir)#.meteor')#/local/build/programs/server/assets/app/')
  for file in fs.readdirSync(cardDir)
    Meteor.call('insertTrello', JSON.parse(fs.readFileSync(cardDir+file)))
)
