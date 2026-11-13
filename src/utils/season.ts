export type SeasonId = 'christmas' | 'default'

export const isChristmasSeason = (date: Date = new Date()): boolean => {
  // Christmas season: November (10), December (11) and January (0). Off from February.
  const month = date.getMonth()
  return month === 10 || month === 11 || month === 0
}

export const getSeason = (date: Date = new Date()): SeasonId => (isChristmasSeason(date) ? 'christmas' : 'default')
