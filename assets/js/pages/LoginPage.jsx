import React, { useState, useContext } from "react";
import axios from "axios";
import AuthAPI from "../services/authAPI";
import AuthContext from "../contexts/AuthContext";
import Field from "../components/Forms/Field";
import { toast } from "react-toastify";

const LoginPage = ({history}) => {

  const { setIsAuthenticated } = useContext(AuthContext);

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (event) => {
    const value = event.currentTarget.value;
    const name = event.currentTarget.name;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await AuthAPI.authenticate(credentials);
      setError("");
      setIsAuthenticated(true);
      toast.success("Vous êtes maintenant identifié");
      history.replace("/");
    } catch (error) {
      console.error("KO KO KO KO");
      setError(
        "Oups ! Aucun compte n'a été trouvé correspondant aux identifiants saisis"
      );
      toast.error("Une erreur est survenue");
    }
  };

  return (
    <>
      <h1>Connexion à l'application</h1>

      <form onSubmit={handleSubmit}>

        <Field label="Adresse email" name="username" value={credentials.username} onChange={handleChange} type="email" placeholder="Adresse email de connexion..." error={error} />

        <Field label="Mot de passe" name="password" value={credentials.password} onChange={handleChange} type="password" placeholder="Mot de passe..." />

        <div className="form-group">
          <button type="submit" className="btn btn-success">
            Connexion
          </button>
        </div>
      </form>
    </>
  );
};

export default LoginPage;
