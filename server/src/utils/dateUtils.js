/**
 * Date normalization and calendar day arithmetic for QuestBoard.
 */

/**
 * Normalizes a Date instance or timestamp into 'YYYY-MM-DD' calendar date string.
 * Supports timezone string (e.g. 'Asia/Kolkata', 'America/New_York')
 * and timezoneOffset in minutes (e.g. -330 for UTC+5:30).
 * Defaults to UTC if no timezone is provided.
 *
 * @param {Date|string|number} [date=new Date()]
 * @param {object} [options={}]
 * @param {string|null} [options.timezone=null]
 * @param {number|string|null} [options.timezoneOffset=null]
 * @returns {string} Normalized 'YYYY-MM-DD'
 */
export function getCalendarDate(date = new Date(), { timezone = null, timezoneOffset = null } = {}) {
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) {
    return new Date().toISOString().split('T')[0];
  }

  if (timezone) {
    try {
      const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
      return formatter.format(d);
    } catch {
      // If invalid timezone identifier, fallback to offset / UTC
    }
  }

  if (timezoneOffset !== null && timezoneOffset !== undefined && !isNaN(Number(timezoneOffset))) {
    // getTimezoneOffset() is (UTC - local) in minutes.
    // e.g. IST is UTC+5:30, getTimezoneOffset() is -330.
    // localTime = UTC - offset = d.getTime() - (-330 * 60000)
    const offsetMs = Number(timezoneOffset) * 60 * 1000;
    const localDate = new Date(d.getTime() - offsetMs);
    return localDate.toISOString().split('T')[0];
  }

  return d.toISOString().split('T')[0];
}

/**
 * Calculates calendar day difference between two 'YYYY-MM-DD' strings.
 * Returns dateStr2 - dateStr1 in full calendar days.
 * e.g. '2026-09-26' to '2026-09-27' => 1 (consecutive)
 *      '2026-09-26' to '2026-09-26' => 0 (same day)
 *      '2026-09-26' to '2026-09-28' => 2 (missed day)
 *
 * @param {string} dateStr1
 * @param {string} dateStr2
 * @returns {number|null} Difference in integer days
 */
export function getCalendarDayDiff(dateStr1, dateStr2) {
  if (!dateStr1 || !dateStr2) return null;
  const parts1 = dateStr1.split('-').map(Number);
  const parts2 = dateStr2.split('-').map(Number);
  if (parts1.length !== 3 || parts2.length !== 3) return null;

  const utcD1 = Date.UTC(parts1[0], parts1[1] - 1, parts1[2]);
  const utcD2 = Date.UTC(parts2[0], parts2[1] - 1, parts2[2]);
  return Math.round((utcD2 - utcD1) / (1000 * 60 * 60 * 24));
}

/**
 * Extracts timezone information from Express request headers/query.
 *
 * @param {object} req Express request
 * @returns {{ timezone: string|null, timezoneOffset: number|null }}
 */
export function extractTimezoneFromReq(req) {
  if (!req) return { timezone: null, timezoneOffset: null };
  const timezone = req.headers?.['x-timezone'] || req.query?.timezone || null;
  const rawOffset = req.headers?.['x-timezone-offset'] !== undefined
    ? req.headers['x-timezone-offset']
    : (req.query?.timezoneOffset !== undefined ? req.query.timezoneOffset : null);
  const timezoneOffset = rawOffset !== null && !isNaN(Number(rawOffset)) ? Number(rawOffset) : null;
  return { timezone, timezoneOffset };
}
