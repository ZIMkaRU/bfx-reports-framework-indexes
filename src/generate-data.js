'use strict'

const count = 1000000
const userCount = 10

let char = 'A'
let userId = 0

const nextChar = (c) => {
  return String.fromCharCode(c.charCodeAt(0) + 1)
}

const rows = new Array(count).fill().map((row, i) => {
  const num = 123456789

  if ((i % (count / userCount)) === 0) {
    char = 'A'
    userId = userId + 1
  }

  char = (i !== 0 && (i % (count / 200)) === 0)
    ? nextChar(char)
    : char

  const currency = `US${char}`

  return {
    id: i,
    currency,
    mts: i,
    amount: num,
    amountUsd: num,
    balance: num,
    _nativeBalance: num,
    balanceUsd: num,
    _nativeBalanceUsd: num,
    description: 'TEST-TEST-TEST',
    wallet: 'funding',
    _category: 123,
    _isMarginFundingPayment: 0,
    _isAffiliateRebate: 0,
    _isStakingPayments: 0,
    _isBalanceRecalced: 0,
    subUserId: null,
    user_id: userId
  }
})

module.exports = (db) => {
  const keys = Object.keys(rows[0])

  const sql = `INSERT INTO
    ledgers(${keys.join(', ')})
    VALUES(${keys.map(v => '$' + v).join(', ')})`

  const stm = db.prepare(sql)

  const trx = db.transaction((rows) => {
    for (const row of rows) {
      stm.run(row)
    }
  })

  trx(rows)
}
