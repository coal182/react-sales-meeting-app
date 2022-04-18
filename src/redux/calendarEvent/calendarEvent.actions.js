import { calendarEventActionTypes } from "./calendarEvent.types";
export const setCalendarEvents = (calendarEvent) => ({
  type: calendarEventActionTypes.SET_CALENDAR_EVENTS,
  payload: calendarEvent,
});
