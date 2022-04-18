import api from "./api";
import { useSelector } from "react-redux";

const getCalendarEvents = (currentUser) => {
  return api.get("calendarevent/list/"+currentUser.user_id);
};
const getCalendarEvent = (id, partner_id, currentUser) => {
    return Promise.all([
        api.get("calendarevent/"+id,{}),
        api.post("salespersoncoordinate", { partner_id: parseInt(partner_id), user: currentUser.code})
    ]);
};

const addCalendarEvent = (event) => {
    return api.put("calendarevent", event);
};

const setCoordinate = (coordinate) => {
    return api.put("salespersoncoordinate", coordinate);
};

const CalendarEventService = {
    getCalendarEvents,
    getCalendarEvent,
    addCalendarEvent,
    setCoordinate
};
export default CalendarEventService;