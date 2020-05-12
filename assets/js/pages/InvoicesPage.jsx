import moment from "moment";
import React, { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import InvoicesAPI from "../services/invoicesAPI.js";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import CommonLoader from "../components/Loaders/CommonLoader";

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
  const [loading, setLoading] = useState(true);

  const fetchInvoices = async () => {
    try {
      const data = await InvoicesAPI.findAll();
      setInvoices(data);
      setLoading(false);
    } catch (error) {
      toast.error("Une anomalie a empêché la récupération de vos factures");
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
      toast.success("La facture a été supprimée avec succès");
    } catch (error) {
      setInvoices(originalInvoices);
      toast.error("Une anomalie a empêché la suppression de cette facture");
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
      <div className="d-flex justify-content-between align-items-center">
        <h1>Liste des factures</h1>
        <Link className="btn btn-primary" to="/invoices/new">
          Créer une facture
        </Link>
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
            <th>Numéro</th>
            <th>Client</th>
            <th className="text-center">Date d'envoi</th>
            <th className="text-center">Status</th>
            <th className="text-center">Montant</th>
            <th></th>
          </tr>
        </thead>

        {!loading && (
          <tbody>
            {paginatedInvoices.map((invoice) => (
              <tr key={invoice.id}>
                <td>{invoice.id}</td>
                <td>{invoice.chrono}</td>
                <td>
                  <Link to={"/customers/" + invoice.customer.id}>
                    {invoice.customer.firstName} {invoice.customer.lastName}
                  </Link>
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
                  <Link
                    to={"/invoices/" + invoice.id}
                    className="btn btn-sm btn-primary mr-1"
                  >
                    Editer
                  </Link>
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
        )}
      </table>

      {loading && <CommonLoader />}

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
