import axios from "axios";

function findAll() {
  return axios
    .get("http://127.0.0.1:8000/api/customers")
    .then((response) => response.data["hydra:member"]);
}

function find(id) {
  return axios
    .get("http://127.0.0.1:8000/api/customers/" + id)
    .then((response) => response.data);
}

function update(id, customer) {
  return axios.put("http://127.0.0.1:8000/api/customers/" + id, customer);
}

function create(customer) {
  return axios.post("http://127.0.0.1:8000/api/customers", customer);
}

function deleteCustomer(id) {
  return axios.delete("http://127.0.0.1:8000/api/customers/" + id);
}

export default {
  findAll: findAll,
  find: find,
  update: update,
  create: create,
  delete: deleteCustomer,
};
