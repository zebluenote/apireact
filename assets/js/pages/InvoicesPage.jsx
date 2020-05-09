import moment from "moment";
import React, { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import InvoicesAPI from "../services/invoicesAPI.js";

const STATUS_CLASSES = {
  SENT: "primary",
  PAID: "success",
  CANCELLED: "danger",
};

const STATUS_LABELS = {
  SENT: "envoyée",
  PAID: "payée",
  CANCELLED: "annulée",
};

const InvoicesPage = (props) => {
  const [invoices, setInvoices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // numéro de la page courante, default = 1
  const [search, setSearch] = useState("");

  const fetchInvoices = async () => {
    try {
      const data = await InvoicesAPI.findAll();
      setInvoices(data);
    } catch (error) {
      console.dir(error.response);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // Gestion de la suppression d'une invoice
  const handleDelete = async (id) => {
    // On fait une copie de la liste des invoices avant suppression
    const originalInvoices = [...invoices];
    // On fait tout de suite disparaitre de l'affichage l'invoice que l'on veut supprimer
    setInvoices(invoices.filter((invoice) => invoice.id !== id));
    // On déclenche la requête de suppression de l'invoice
    try {
      await InvoicesAPI.delete(id);
    } catch (error) {
      console.dir(error.response);
      setInvoices(originalInvoices);
    }
  };

  // Gestion du format d'affichage de la date
  const formatDate = (str) => moment(str).format("DD/MM/YYYY");

  // Gestion du changement de page
  const handlePageChange = (page) => setCurrentPage(page);

  // Gestion de la recherche
  const handleSearch = (event) => {
    setSearch(event.currentTarget.value);
    setCurrentPage(1);
  };

  const itemsPerPage = 10;

  // Filtrage de la liste des invoices en fonction de la chaîne recherchée
  const filteredInvoices = invoices.filter(
    (i) =>
      i.customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
      i.customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
      i.amount.toString().includes(search.toLowerCase()) ||
      STATUS_LABELS[i.status].toLowerCase().includes(search.toLowerCase())
  );

  // Système de pagination de la liste des invoices
  const paginatedInvoices = Pagination.getData(
    filteredInvoices,
    currentPage,
    itemsPerPage
  );

  return (
    <>
      <h1>Liste des factures</h1>

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
            <th>Numéro</th>
            <th>Client</th>
            <th className="text-center">Date d'envoi</th>
            <th className="text-center">Status</th>
            <th className="text-center">Montant</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {paginatedInvoices.map((invoice) => (
            <tr key={invoice.id}>
              <td>{invoice.id}</td>
              <td>{invoice.chrono}</td>
              <td>
                <a href="#">
                  {invoice.customer.firstName} {invoice.customer.lastName}
                </a>
              </td>
              <td className="text-center">{formatDate(invoice.sentAt)}</td>
              <td className="text-center">
                <span
                  className={"badge badge-" + STATUS_CLASSES[invoice.status]}
                >
                  {STATUS_LABELS[invoice.status]}
                </span>
              </td>
              <td className="text-center">
                {invoice.amount.toLocaleString()} €
              </td>
              <td>
                <button className="btn btn-sm btn-primary mr-1">Editer</button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(invoice.id)}
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
        onPageChange={handlePageChange}
        length={filteredInvoices.length}
      ></Pagination>
    </>
  );
};

export default InvoicesPage;
