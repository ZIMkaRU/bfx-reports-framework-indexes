'use strict'

const Database = require('better-sqlite3')
const path = require('path')
const {
  rmdirSync,
  mkdirSync
} = require('fs')

const dbFolder = path.join(__dirname, 'db')
const dbPath = path.join(dbFolder, 'test-db.db')

const createTable = require('./src/create-table')
const generateData = require('./src/generate-data')

rmdirSync(dbFolder, { recursive: true })
mkdirSync(dbFolder, { recursive: true })

const db = new Database(dbPath)

const log = (prevDate, label) => {
  const d = new Date()
  const diff = d - prevDate

  console.log(
    `[TIME${label ? '-' : ''}${label}]:`,
    diff
  )

  return diff
}

createTable(db)
generateData(db)

const queryAndCheckLength = (sql, length, label) => {
  const date = new Date()
  const res = db.prepare(sql).all()
  log(date, label)
  console.log('[RES LENGTH]:', res.length)

  if (
    !Array.isArray(res) ||
    res.length === length
  ) {
    throw new Error('ERR_RES_HAS_WRONG_LENGTH')
  }
}

const sql1 = `SELECT * FROM ledgers
  WHERE mts >= 0 AND mts <= 1000000 AND currency = 'USD' AND user_id = 2
  ORDER BY mts DESC, id DESC
  LIMIT 2500`
const sql2 = `SELECT * FROM ledgers
  WHERE user_id = 2 AND currency = 'USD' AND mts >=0 and mts <= 1000000
  ORDER BY mts DESC, id DESC
  LIMIT 2500`

// #1
queryAndCheckLength(sql1, 0, '#1-without indexes for SQL#1')

// #2
db.prepare(
  `CREATE INDEX ledgers_mts_currency_user_id
    ON ledgers(mts, currency, user_id)`
).run()
db.prepare('ANALYZE').run()
queryAndCheckLength(sql1, 0, '#2-with ledgers_mts_currency_user_id index for SQL#1')
db.prepare('DROP INDEX ledgers_mts_currency_user_id').run()

// #3
db.prepare(
  `CREATE INDEX ledgers_user_id_currency_mts
    ON ledgers(user_id, currency, mts)`
).run()
db.prepare('ANALYZE').run()
queryAndCheckLength(sql1, 0, '#3-with ledgers_user_id_currency_mts index for SQL#1')

// #4
queryAndCheckLength(sql2, 0, '#4-with ledgers_user_id_currency_mts index for SQL#2')
db.prepare('DROP INDEX ledgers_user_id_currency_mts').run()

// Additiontal

// #5 user_id, mts
db.prepare(
  `CREATE INDEX ledgers_user_id_mts
    ON ledgers(user_id, mts)`
).run()
db.prepare('ANALYZE').run()
queryAndCheckLength(sql1, 0, '#5-with ledgers_user_id_mts index for SQL#1')
db.prepare('DROP INDEX ledgers_user_id_mts').run()

// #6 currency, mts
db.prepare(
  `CREATE INDEX ledgers_currency_mts
    ON ledgers(currency, mts)`
).run()
db.prepare('ANALYZE').run()
queryAndCheckLength(sql1, 0, '#6-with ledgers_currency_mts index for SQL#1')
db.prepare('DROP INDEX ledgers_currency_mts').run()

// #7 Before
db.prepare(
  `CREATE INDEX ledgers_mts_currency
    ON ledgers(mts, currency)`
).run()
db.prepare('ANALYZE').run()
queryAndCheckLength(sql1, 0, '#7-with ledgers_mts_currency index for SQL#1')
db.prepare('DROP INDEX ledgers_mts_currency').run()

rmdirSync(dbFolder, { recursive: true })
