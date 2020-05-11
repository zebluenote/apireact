import axios from "axios";

function findAll() {
    return axios
    .get("http://127.0.0.1:8000/api/invoices")
    .then((response) => response.data["hydra:member"]);
}

function find(id) {
    return axios
        .get("http://127.0.0.1:8000/api/invoices/" + id)
        .then((response) => response.data);
}

function deleteInvoice(id) {
    return axios
      .delete("http://127.0.0.1:8000/api/invoices/" + id);
}

function create(invoice) {
    // Il faut fournir un IRI pour le customer
    return axios.post(
        "http://127.0.0.1:8000/api/invoices",
        {
          ...invoice,
          customer: `/api/customers/${invoice.customer}`,
        }
      );
}

function update(id, invoice){
    return axios.put(
        "http://127.0.0.1:8000/api/invoices/" + id,
        {
          ...invoice,
          customer: `/api/customers/${invoice.customer}`,
        }
      );
}

export default {
    findAll: findAll,
    find: find,
    create: create,
    delete: deleteInvoice,
    update: update
}