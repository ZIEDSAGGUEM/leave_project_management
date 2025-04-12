import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import GlassPanel from "../components/GlassPanel";
import Button from "../components/Button";
import useUserStore from "../store/useUserStore";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  
  const { login, isLoading,isAuthenticated, error } = useUserStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    try {
      await login(email, password);
      
      // Check error state after login attempt
      const currentError = useUserStore.getState().error;
      if (currentError) {
        toast.error(currentError);
        return;
      }

      // Only navigate if authenticated and no error
      const currentUser = useUserStore.getState().user;
      if (currentUser) {
        toast.success("Connexion réussie !");
        if (currentUser.isAdmin) {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      }

    } catch (error) {
      toast.error("Erreur de connexion");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gradient-to-b from-blue-50 to-gray-50">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
            LeaveFlow
          </h1>
          <p className="mt-2 text-muted-foreground">
            Système de gestion des demandes de congés
          </p>
        </div>

        <GlassPanel className="mb-6">
          <h2 className="text-xl font-semibold mb-6">Connexion</h2>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="votre@email.com"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Mot de passe
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>

              <Button type="submit" className="w-full" loading={isLoading}>
                Se connecter
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            <p>
              Vous n'avez pas de compte ?{" "}
              <Link to="/register" className="text-primary hover:underline">
                S'inscrire
              </Link>
            </p>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
};

export default Login;
