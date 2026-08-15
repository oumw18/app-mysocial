import { useState } from "react";
import { Link, useNavigate } from "react-router";
import api from "../lib/api";
import toast from "react-hot-toast";
import InputFloat from "../ux/InputFloat";

export default function Register() {
  const [form, setForm] = useState({ email: "", password: "", username: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post(`/auth/register`, form);

      toast.success("Inscription réussie");
      navigate("/login");
    } catch (e) {
      toast.error(e);
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
        <h2 className="text-2xl font-bold text-center mb-6">Inscription</h2>
        <div className="flex flex-col space-y-4 w-f">
          <InputFloat
            type="text"
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <InputFloat
            type="text"
            label="Nom d'utilisateur"
            name="username"
            value={form.username}
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
            {loading ? "Insciption..." : "S'inscrire"}
          </button>
          <span className="text-center">
            Déjà un compte ?{" "}
            <Link to={"/login"} className="link">
              Connectez-vous
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
}
