import { messageActionTypes } from "./message.types";
export const setMessage = (message) => ({
  type: messageActionTypes.SET_MESSAGE,
  payload: message,
});
export const clearMessage = () => ({
  type: messageActionTypes.CLEAR_MESSAGE,
});