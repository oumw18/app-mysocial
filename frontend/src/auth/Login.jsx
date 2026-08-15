import { Link, useNavigate } from "react-router";
import { useState } from "react";
import api from "../lib/api";
import toast from "react-hot-toast";
import InputFloat from "../ux/InputFloat";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post(`/auth/login`, form);

      localStorage.setItem("token", res.data.token);

      toast.success("Connexion réussie !");
      navigate("/");
    } catch (e) {
      toast.error("Identifiants incorrects");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="h-dvh flex items-center justify-center bg-base-200">
      <form onSubmit={onForm} className="card w-96 bg-base-100 shadow-xl p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Connexion</h2>
        <div className="flex flex-col space-y-4 w-full">
          <InputFloat
            type="text"
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <InputFloat
            type="password"
            label="Mot de passe"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className={`btn btn-accent ${loading ? "loading" : ""}`}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
          <span className="text-center">
            Vous n'avez pas de compte ?{" "}
            <Link to={"/register"} className="link">
              Inscrivez-vous
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
}
