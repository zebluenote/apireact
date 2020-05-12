import React, { useState } from "react";
import Field from "../components/Forms/Field";
import { Link } from "react-router-dom";
import UsersAPI from "../services/usersAPI";
import { toast } from "react-toastify";

const RegisterPage = ({ history }) => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    const apiErrors = {};

    if (user.password !== user.passwordConfirm) {
      apiErrors.passwordConfirm =
        "Les deux mots de passe ne correspondent pas, veuillez corriger";
      setErrors(apiErrors);
      toast.error("Anomalie dans les mots de passe");
      return;
    }

    try {
      await UsersAPI.register(user);
      setErrors({});
      // TODO flash success
      toast.success("Vous êtes maintenant inscrit, vous pouvez désormais vous identifier.")
      history.replace("/login");
    } catch (error) {
      const { violations } = error.response.data;
      if (violations) {
        violations.forEach((violation) => {
          apiErrors[violation.propertyPath] = violation.message;
        });
        setErrors(apiErrors);
      }
      toast.error("Il y a eu des erreurs dans le traitement formulaire");
    }
  };

  /**
   * Gestion du changement des inputs dans le formulaire
   * React : on ne peut pas fournir une valeur sans fournir le onChange !
   */
  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setUser({ ...user, [name]: value });
  };

  return (
    <>
      <h1>Formulaire d'inscription</h1>

      <form onSubmit={handleSubmit}>
        <Field
          name="firstName"
          label="Prénom"
          placeholder="Votre prénom..."
          type="text"
          error={errors.firstName}
          value={user.firstName}
          onChange={handleChange}
        />
        <Field
          name="lastName"
          label="Nom"
          placeholder="Votre nom de famille..."
          type="text"
          error={errors.lastName}
          value={user.lastName}
          onChange={handleChange}
        />
        <Field
          name="email"
          label="Votre email"
          placeholder="Votre adresse email..."
          type="email"
          error={errors.email}
          value={user.email}
          onChange={handleChange}
        />
        <Field
          name="password"
          label="Mot de passe"
          placeholder="Votre mot de passe..."
          type="password"
          error={errors.password}
          value={user.password}
          onChange={handleChange}
        />
        <Field
          name="passwordConfirm"
          label="Mot de passe (confirmation)"
          placeholder="Confirmez votre mot de passe..."
          type="password"
          error={errors.passwordConfirm}
          value={user.passwordConfirm}
          onChange={handleChange}
        />
        <div className="form-group mt-4">
          <button type="submit" className="btn btn-success">
            Confirmation
          </button>
          <Link to="/login" className="btn btn-link">
            J'ai déjà un compte
          </Link>
        </div>
      </form>
    </>
  );
};

export default RegisterPage;
