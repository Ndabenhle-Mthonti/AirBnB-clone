/**
 * DatePanel.js
 * ------------
 * Two-month calendar for choosing check-in and check-out dates.
 *
 * Selection rules:
 *  - First click sets check-in.
 *  - Second click after check-in sets check-out.
 *  - Clicking before check-in starts over with a new check-in date.
 *  - Past dates are disabled.
 */

import { useState } from 'react'
import './DatePanel.css'

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const startOfDay = (date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate())

const isSameDay = (firstDate, secondDate) =>
  firstDate &&
  secondDate &&
  startOfDay(firstDate).getTime() === startOfDay(secondDate).getTime()

const isBetweenDates = (date, checkIn, checkOut) => {
  if (!checkIn || !checkOut) return false

  const dayTime = startOfDay(date).getTime()
  return dayTime > startOfDay(checkIn).getTime() && dayTime < startOfDay(checkOut).getTime()
}

const getMonthTitle = (date) =>
  date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

const getAriaLabel = (date) =>
  date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })

const getCalendarDays = (monthDate) => {
  const year = monthDate.getFullYear()
  const month = monthDate.getMonth()
  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const days = []

  // Convert Sunday-based getDay() to Monday-first calendar spacing.
  const leadingBlanks = (firstDayOfMonth.getDay() + 6) % 7

  for (let blank = 0; blank < leadingBlanks; blank += 1) {
    days.push(null)
  }

  for (let day = 1; day <= lastDayOfMonth.getDate(); day += 1) {
    days.push(new Date(year, month, day))
  }

  return days
}

const CalendarMonth = ({ monthDate, checkIn, checkOut, onDateClick }) => {
  const today = startOfDay(new Date())

  return (
    <div className="calendar-month">
      <h3>{getMonthTitle(monthDate)}</h3>

      <div className="calendar-weekdays">
        {weekdays.map((weekday) => (
          <span key={weekday}>{weekday}</span>
        ))}
      </div>

      <div className="calendar-days">
        {getCalendarDays(monthDate).map((date, index) => {
          if (!date) {
            return <span className="calendar-empty-day" key={`empty-${index}`} />
          }

          const isPast = startOfDay(date).getTime() < today.getTime()
          const isStart = isSameDay(date, checkIn)
          const isEnd = isSameDay(date, checkOut)
          const isInRange = isBetweenDates(date, checkIn, checkOut)

          return (
            <button
              className={`calendar-day ${
                isStart || isEnd ? 'calendar-day--selected' : ''
              } ${isInRange ? 'calendar-day--range' : ''}`}
              type="button"
              key={date.toISOString()}
              disabled={isPast}
              aria-label={getAriaLabel(date)}
              onClick={() => onDateClick(date)}
            >
              {date.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}

const DatePanel = ({ checkIn, checkOut, onCheckInChange, onCheckOutChange }) => {
  const [visibleMonth, setVisibleMonth] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  )

  const nextMonth = new Date(
    visibleMonth.getFullYear(),
    visibleMonth.getMonth() + 1,
    1,
  )

  const handleDateClick = (date) => {
    if (!checkIn || (checkIn && checkOut)) {
      onCheckInChange(date)
      onCheckOutChange(null)
      return
    }

    if (startOfDay(date).getTime() <= startOfDay(checkIn).getTime()) {
      onCheckInChange(date)
      onCheckOutChange(null)
      return
    }

    onCheckOutChange(date)
  }

  const goToPreviousMonth = () => {
    setVisibleMonth(
      new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1),
    )
  }

  const goToNextMonth = () => {
    setVisibleMonth(
      new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1),
    )
  }

  return (
    <div className="search-panel date-panel" role="dialog" aria-label="Choose dates">
      <div className="date-panel-controls">
        <button type="button" onClick={goToPreviousMonth} aria-label="Previous month">
          ‹
        </button>
        <button type="button" onClick={goToNextMonth} aria-label="Next month">
          ›
        </button>
      </div>

      <div className="date-panel-calendars">
        <CalendarMonth
          monthDate={visibleMonth}
          checkIn={checkIn}
          checkOut={checkOut}
          onDateClick={handleDateClick}
        />
        <CalendarMonth
          monthDate={nextMonth}
          checkIn={checkIn}
          checkOut={checkOut}
          onDateClick={handleDateClick}
        />
      </div>

      <p className="date-panel-summary">
        Check-in: {checkIn ? checkIn.toLocaleDateString() : 'Not selected'} →
        Check-out: {checkOut ? checkOut.toLocaleDateString() : 'Not selected'}
      </p>
    </div>
  )
}

export default DatePanel
