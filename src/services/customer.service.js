import api from "./api";
import { useSelector } from "react-redux";

const getCustomer = (user_id, customer_id) => {
  return api.get("customer/"+user_id+"/"+customer_id);
};

const getCustomers = (user_id, filterName) => {
  return api.get("customer/list/"+user_id+"/"+filterName);
};

const addCustomer = (new_customer) => {
  return api.put("customer", new_customer);
};

const CustomerService = {
    getCustomer,
    getCustomers,
    addCustomer
};
export default CustomerService;