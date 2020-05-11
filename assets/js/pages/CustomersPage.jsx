import React, { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import CustomersAPI from "../services/customersAPI.js";
import { Link } from "react-router-dom";

const CustomersPage = (props) => {
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // numéro de la page courante, default = 1
  const [search, setSearch] = useState("");

  // Fonction permettant de récupérer les customers dans la bdd
  const fetchCustomers = async () => {
    try {
      const data = await CustomersAPI.findAll();
      setCustomers(data);
    } catch (error) {
      console.dir(error.response);
    }
  };

  // Au chargement du composant, on lance la récupération des customers
  useEffect(() => {
    fetchCustomers();
  }, []);

  // Gestion de la suppression d'un customer
  const handleDelete = async (id) => {
    // On fait une copie de la liste des customers avant suppression
    const originalCustomers = [...customers];
    // On fait tout de suite disparaitre de l'affichage le customer que l'on veut supprimer
    setCustomers(customers.filter((customer) => customer.id !== id));
    // On déclenche la requête de suppression du customer
    try {
      await CustomersAPI.delete(id);
    } catch (error) {
      console.dir(error.response);
      setCustomers(originalCustomers);
    }
  };

  // Gestion du changement de page
  const handlePageChange = (page) => setCurrentPage(page);

  // Gestion de la recherche
  const handleSearch = (event) => {
    setSearch(event.currentTarget.value);
    setCurrentPage(1);
  };

  const itemsPerPage = 10;

  // Filtrage de la liste des customers en fonction de la chaîne recherchée
  const filteredCustomers = customers.filter(
    (c) =>
      c.firstName.toLowerCase().includes(search.toLowerCase()) ||
      c.lastName.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.company && c.company.toLowerCase().includes(search.toLowerCase()))
  );

  // Système de pagination de la liste des customers
  const paginatedCustomers = Pagination.getData(
    filteredCustomers,
    currentPage,
    itemsPerPage
  );

  return (
    <>
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <h1>Liste des clients</h1>
        <Link to="/customers/new" className="btn btn-primary">Créer un client</Link>
      </div>

      <div className="form-group">
        <input
          type="text"
          onChange={handleSearch}
          value={search}
          className="form-control"
          placeholder="Rechercher..."
        ></input>
      </div>

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
          {paginatedCustomers.map((customer) => (
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

      {itemsPerPage < filteredCustomers.length && (
        <Pagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          length={filteredCustomers.length}
          onPageChange={handlePageChange}
        />
      )}
    </>
  );
};

export default CustomersPage;
