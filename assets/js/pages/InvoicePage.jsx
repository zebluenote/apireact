import React, { useState, useEffect } from "react";
import Field from "../components/Forms/Field";
import Select from "../components/Forms/Select";
import { Link } from "react-router-dom";
import CustomersAPI from "../services/customersAPI";
import InvoicesAPI from "../services/invoicesAPI";
import { toast } from "react-toastify";
import CommonLoader from "../components/Loaders/CommonLoader";

const InvoicePage = ({ history, match }) => {
  const { id = "new" } = match.params;
  const [invoice, setInvoice] = useState({
    amount: "",
    customer: "",
    status: "",
  });
  const [customers, setCustomers] = useState([]);
  const [editing, setEditing] = useState(false);
  const [errors, setErrors] = useState({
    amount: "",
    customer: "",
    status: "",
  });
  const [loading, setLoading] = useState(true);

  /**
   * Récupération des clients
   */
  const fetchCustomers = async () => {
    try {
      const data = await CustomersAPI.findAll();
      setCustomers(data);
      setLoading(false);
    } catch (error) {
      toast.error("Une anomalie a empêché la récupération de vos clients");
      setLoading(false);
      history.replace("/invoices");
    }
  };

  /**
   * Récupération d'une facture
   * @param {integer} id
   */
  const fetchInvoice = async (id) => {
    try {
      const data = await InvoicesAPI.find(id);
      const { amount, status, customer } = data;
      setInvoice({ amount, status, customer: customer.id });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(
        "Une anomalie a empêché la récupération de la facture demandée"
      );
      history.replace("/invoices");
    }
  };

  // Récupération de la liste des customers à chaque chargement du composant
  useEffect(() => {
    fetchCustomers();
  }, []);

  /**
   * Récupération de la facture correspondant à l'identifiant transmis dans l'url
   */
  useEffect(() => {
    if (id !== "new") {
      fetchInvoice(id);
      setEditing(true);
    }
  }, [id]);

  /**
   * Gestion du changement des inputs dans le formulaire
   * React : on ne peut pas fournir une valeur sans fournir le onChange !
   */
  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setInvoice({ ...invoice, [name]: value });
  };

  /**
   * Gestion de la soumission du formulaire
   * @param {object} event
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editing) {
        await InvoicesAPI.update(id, invoice);
        toast.success("La facture a été mise à jour");
      } else {
        await InvoicesAPI.create(invoice);
        toast.success("La facture a été créée");
        history.replace("/invoices");
      }
    } catch ({ response }) {
      toast.error("Le traitement de la facture a échoué");
      const { violations } = response.data;
      if (violations) {
        const apiErrors = {};
        violations.forEach(({ propertyPath, message }) => {
          apiErrors[propertyPath] = message;
        });
        setErrors(apiErrors);
      }
    }
  };

  return (
    <>
      {(!editing && <h1>Création d'une facture</h1>) || (
        <h1>Modification d'une facture</h1>
      )}

      {loading && <CommonLoader />}

      {!loading && (
        <form onSubmit={handleSubmit}>
          <Field
            onChange={handleChange}
            name="amount"
            type="float"
            placeholder="Montant de la facture"
            label="Montant"
            value={invoice.amount}
            error={errors.amount}
          />

          <Select
            onChange={handleChange}
            name="customer"
            value={invoice.customer}
            error={errors.customer}
            label="Client"
          >
            <option value="">Choisissez un client</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.firstName} {customer.lastName}
              </option>
            ))}
          </Select>

          <Select
            onChange={handleChange}
            name="status"
            label="Status"
            value={invoice.status}
            error={errors.status}
          >
            <option value="">Choisissez un status</option>
            <option value="SENT">Envoyée</option>
            <option value="PAID">Payée</option>
            <option value="CANCELLED">Annulée</option>
          </Select>

          <div className="form-group mt-4">
            <button type="submit" className="btn btn-success">
              Enregistrer
            </button>
            <Link to="/invoices" className="btn btn-link">
              Retout aux factures
            </Link>
          </div>
        </form>
      )}
    </>
  );
};

export default InvoicePage;
