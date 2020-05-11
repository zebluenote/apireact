import React, { useState, useEffect } from "react";
import Field from "../components/Forms/Field";
import { Link } from "react-router-dom";
import CustomersAPI from "../services/customersAPI";

const CustomerPage = ({ match, history }) => {
  // Recherche du Id transmis dans la requête (new ou integer)
  // Si integer alors mode édition
  const { id = "new" } = match.params;

  const [customer, setCustomer] = useState({
    lastName: "",
    firstName: "",
    email: "",
    company: "",
  });

  /**
   * Gestion des erreurs
   */
  const [errors, setErrors] = useState({
    lastName: "",
    firstName: "",
    email: "",
    company: "",
  });

  /**
   * Création d'un state qui va permettre de disciminer new ou édition
   */
   const [editing, setEditing] = useState(false);

   /**
   * En cas d'édition récupération des données du customer en fonction de son id
   * @param {integer} id 
   */
  const fetchCustomer = async (id) => {
    try {
      const data = await CustomersAPI.find(id);
      // On extrait juste ce dont on a besoin des données retournées
      const { firstName, lastName, email, company } = data;
      setCustomer({ firstName, lastName, email, company });
    } catch (error) {
      console.dir(error.response);
      // TODO : notification flash d'une erreur
      history.replace("/customers");
    }
  };

/**
 * Chargement du customer si besoin au chargement du composant ou en cas de changement d'identifiant
 */
  useEffect(() => {
    if (id !== "new") {
      setEditing(true);
      fetchCustomer(id);
    }
  }, [id]);

  /**
   * Gestion du changement des inputs dans le formulaire
   * React : on ne peut pas fournir une valeur sans fournir le onChange !
   */
  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setCustomer({ ...customer, [name]: value });
  };

  /**
   * Gestion de la soumission du formulaire de création d'un nouveau client
   * @param {object} event
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editing) {
        await CustomersAPI.update(id, customer);
        // TODO Flash notification de succès
      } else {
        await CustomersAPI.create(customer);
        // TODO Flash notification de succès
        history.replace("/customers");
      }
      setErrors({});
    } catch ({ response }) {
      // TODO Flash notification d'erreur
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
      {(!editing && <h1>Création d'un client</h1>) || (
        <h1>Edition d'un client</h1>
      )}
      <form onSubmit={handleSubmit}>
        <Field
          name="lastName"
          label="Nom de famille"
          placeholder="Nom de famille du client..."
          value={customer.lastName}
          onChange={handleChange}
          error={errors.lastName}
        />
        <Field
          name="firstName"
          label="Prénom"
          placeholder="Prénom du client..."
          value={customer.firstName}
          onChange={handleChange}
          error={errors.firstName}
        />
        <Field
          name="email"
          label="Email"
          placeholder="Adresse email du client..."
          type="email"
          value={customer.email}
          onChange={handleChange}
          error={errors.email}
        />
        <Field
          name="company"
          label="Entreprise"
          placeholder="Entreprise du client..."
          value={customer.company}
          onChange={handleChange}
          error={errors.company}
        />
        <div className="form-group mt-4">
          <button type="submit" className="btn btn-success">
            Enregistrer
          </button>
          <Link to="/customers" className="btn btn-link">
            Retour à la liste
          </Link>
        </div>
      </form>
    </>
  );
};

export default CustomerPage;
