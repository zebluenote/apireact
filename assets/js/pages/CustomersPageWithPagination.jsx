import React, { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "../components/Pagination";

const CustomersPageWithPagination = (props) => {
  const [customers, setCustomers] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1); // numéro de la page courante, default = 1
  const itemsPerPage = 8;

  useEffect(() => {
    axios
      .get(
        `http://127.0.0.1:8000/api/customers?pagination=true&itemsPerPage=${itemsPerPage}&page=${currentPage}`
      )
      .then((response) => {
        setCustomers(response.data["hydra:member"]);
        setTotalItems(response.data["hydra:totalItems"]);
      })
      .catch((error) => console.dir(error.response));
  }, [currentPage]);

  const handleDelete = (id) => {
    // On fait une copie de la liste des customers avant suppression
    const originalCustomers = [...customers];

    // On fait tout de suite disparaitre de l'affichage le customer que l'on veut supprimer
    setCustomers(customers.filter((customer) => customer.id !== id));

    // On déclenche la requête de suppression du customer
    axios
      .delete("http://127.0.0.1:8000/api/customers/" + id)
      .then((response) => console.log("OK"))
      .catch((error) => {
        setCustomers(originalCustomers);
        console.dir(error.response);
      });
  };

  // Système de pagination de la liste des customers
  const handlePageChange = (page) => {
    setCustomers([]);
    setCurrentPage(page);
  };

  return (
    <>
      <h1>Liste des clients (paginée)</h1>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Id.</th>
            <th>Client</th>
            <th>Email</th>
            <th>Entreprise</th>
            <th className="text-center">Factures</th>
            <th className="text-center">Montant total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {customers.length === 0 && (
            <tr>
              <td>Chargement...</td>
            </tr>
          )}
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.id}</td>
              <td>
                <a href="#">
                  {customer.firstName} {customer.lastName}
                </a>
              </td>
              <td>{customer.email}</td>
              <td>{customer.company}</td>
              <td className="text-center">
                <span className="badge badge-primary">
                  {customer.invoices.length}
                </span>
              </td>
              <td className="text-center">
                {customer.totalAmount.toLocaleString()} €
              </td>
              <td>
                <button
                  onClick={() => handleDelete(customer.id)}
                  disabled={customer.invoices.length > 0}
                  className="btn btn-sm btn-danger"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        length={totalItems}
        onPageChange={handlePageChange}
      />
    </>
  );
};

export default CustomersPageWithPagination;
