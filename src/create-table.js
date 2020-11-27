'use strict'

module.exports = (db) => {
  const sql = `CREATE TABLE ledgers
(
  _id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, 
  id BIGINT, 
  currency VARCHAR(255), 
  mts BIGINT, 
  amount DECIMAL(22,12), 
  amountUsd DECIMAL(22,12), 
  balance DECIMAL(22,12), 
  _nativeBalance DECIMAL(22,12), 
  balanceUsd DECIMAL(22,12), 
  _nativeBalanceUsd DECIMAL(22,12), 
  description TEXT, 
  wallet VARCHAR(255), 
  _category INT, 
  _isMarginFundingPayment INT, 
  _isAffiliateRebate INT, 
  _isStakingPayments INT, 
  _isBalanceRecalced INT, 
  subUserId INT, 
  user_id INT NOT NULL
)`

  db.prepare(sql).run()
}
