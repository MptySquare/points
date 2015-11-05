Schemas.Expense = new SimpleSchema(
  payee:
    type: String
  amount:
    type: Number
  date:
    type: Date,
    autoform: {
      type: 'pickadate'
    }
    optional: true
  parts:
    type: [Object]
    optional: true
  category:
    type: [String]
    optional: true
  payer:
    type: [String]
    optional: true
)
