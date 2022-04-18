import { calendarEventActionTypes } from "./calendarEvent.types";
const initialState = {};
export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case calendarEventActionTypes.SET_MESSAGE:
      return { message: payload };
    case calendarEventActionTypes.CLEAR_MESSAGE:
      return { message: "" };
    default:
      return state;
  }
}