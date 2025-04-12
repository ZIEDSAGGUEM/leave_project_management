
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import GlassPanel from '../components/GlassPanel';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gradient-to-b from-blue-50 to-gray-50">
      <GlassPanel className="max-w-md w-full text-center py-12 animate-scale-in">
        <h1 className="text-6xl font-bold text-primary mb-6">404</h1>
        <h2 className="text-2xl font-semibold mb-3">Page non trouvée</h2>
        <p className="text-muted-foreground mb-8">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <Link to="/dashboard">
          <Button>
            Retour au tableau de bord
          </Button>
        </Link>
      </GlassPanel>
    </div>
  );
};

export default NotFound;
