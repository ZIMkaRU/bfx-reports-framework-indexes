'use strict'

const rows = new Array(3000000).fill().map(() => ({
  value1: 123456789,
  value2: 123456789,
  value3: 123456789,
  value4: 123456789,
  value5: 123456789,
  description1: 'description',
  description2: 'description',
  description3: 'description',
  description4: 'description',
  description5: 'description',
  boolean1: true,
  boolean2: true,
  boolean3: true,
  boolean4: true,
  null1: null,
  null2: null,
  null3: null,
  null4: null,
  null5: null,
  undefined1: undefined,
  undefined2: undefined,
  undefined3: undefined,
  undefined4: undefined,
  undefined5: undefined
}))

const log = (prevDate, label) => {
  const d = new Date()
  const diff = d - prevDate

  console.log(
    `[TIME${label ? '-' : ''}${label}]:`,
    diff
  )

  return diff
}

const run = (label, fn) => {
  const date = new Date()

  fn()

  log(date, label)
}

// #1
run('#1-spread', () => {
  const arr = []

  for (const row of rows) {
    arr.push({ ...row })
  }
})

// #2
run('#2-Object.assign', () => {
  const arr = []

  for (const row of rows) {
    arr.push(Object.assign({}, row))
  }
})
