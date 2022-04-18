import { messageActionTypes } from "./message.types";
const initialState = {};
export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case messageActionTypes.SET_MESSAGE:
      return { message: payload };
    case messageActionTypes.CLEAR_MESSAGE:
      return { message: "" };
    default:
      return state;
  }
}