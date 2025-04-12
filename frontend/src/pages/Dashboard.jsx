import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import GlassPanel from "../components/GlassPanel";
import LeaveCard from "../components/LeaveCard";
import Button from "../components/Button";
import Badge from "../components/Badge";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import useLeaveStore from "../store/useLeaveStore";

const Dashboard = ({ user }) => {
  const { leaveRequests, isLoading, fetchUserLeaves } = useLeaveStore();

  const handleDownloadPDF = async () => {
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        putOnlyUsedFonts: true,
      });
      doc.setFontSize(20);
      doc.setTextColor(0, 102, 204); // Set title color to a blue shade
      doc.text("Historique des Congés", 105, 20, { align: "center" });
      doc.setFontSize(14);
      doc.setTextColor(40); // Set text color for better visibility
      let yPosition = 40;

      // Add a header for the leave requests
      doc.setTextColor(255, 87, 34); // Set header color to a vibrant orange
      doc.text("Liste des demandes de congés", 20, yPosition);
      yPosition += 10;

      leaveRequests.forEach((leave, index) => {
        const formatDate = (dateString) => {
          const date = new Date(dateString);
          const day = String(date.getDate()).padStart(2, "0");
          const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
          const year = date.getFullYear();
          return `${day}/${month}/${year}`;
        };

        const leaveDetails = `${index + 1}. Type: ${
          leave.type
        }, Début: ${formatDate(leave.startDate)}, Fin: ${formatDate(
          leave.endDate
        )}, Statut: ${leave.status}`;

        // Include reason only if the leave is rejected
        const reasonDetails =
          leave.status === "rejected"
            ? `, Raison de Refus: ${leave.reasonRefuse}`
            : "";

        // Alternate colors for each leave request
        doc.setTextColor(index % 2 === 0 ? 0 : 102, 153, 0); // Green for even, dark green for odd
        doc.text(leaveDetails + reasonDetails, 20, yPosition, {
          maxWidth: 180,
        }); // Increased maxWidth for better text display
        yPosition += 10;
      });

      // Add a footer
      doc.setFontSize(10);
      doc.setTextColor(128, 128, 128); // Set footer color to gray
      doc.text(
        "Généré le: " + new Date().toLocaleDateString("fr-FR"),
        20,
        yPosition
      );

      const pdfOutput = doc.output("blob");
      const url = window.URL.createObjectURL(pdfOutput);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "conges.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); // Clean up the link element
    } catch (err) {
      console.error("Erreur de génération du PDF", err);
    }
  };

  useEffect(() => {
    fetchUserLeaves(user.token);
  }, [user.token, fetchUserLeaves]);

  return (
    <div className="page-container pt-24">
      <h1 className="page-title">Tableau de bord</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <GlassPanel
          className="animate-fade-in"
          style={{ animationDelay: "0.1s" }}
        >
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Congés annuels
          </h3>
          <div className="text-3xl font-semibold">
            {user.leaveBalance?.annual || 0} jours
          </div>
          <Badge variant="annual" className="mt-2">
            Disponible
          </Badge>
        </GlassPanel>

        <GlassPanel
          className="animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Congés maladie
          </h3>
          <div className="text-3xl font-semibold">
            {user.leaveBalance?.sick || 0} jours
          </div>
          <Badge variant="sick" className="mt-2">
            Disponible
          </Badge>
        </GlassPanel>

        <GlassPanel
          className="animate-fade-in"
          style={{ animationDelay: "0.3s" }}
        >
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Congés exceptionnels
          </h3>
          <div className="text-3xl font-semibold">
            {user.leaveBalance?.personal || 0} jours
          </div>
          <Badge variant="special" className="mt-2">
            Disponible
          </Badge>
        </GlassPanel>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Mes demandes de congés</h2>
        <Link to="/request-leave">
          <Button>Nouvelle demande</Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-pulse-soft">Chargement des demandes...</div>
        </div>
      ) : leaveRequests.length > 0 ? (
        <div className="space-y-4">
          <Button
            onClick={handleDownloadPDF}
            className="mt-4 bg-blue-500 text-white p-2 rounded"
          >
            Télécharger mon historique des congés (PDF)
          </Button>
          {leaveRequests.map((request, index) => (
            <LeaveCard
              key={request.id}
              request={request}
              style={{ animationDelay: `${0.1 * index}s` }}
            />
          ))}
        </div>
      ) : (
        <GlassPanel className="text-center py-8">
          <p className="text-muted-foreground mb-4">
            Vous n'avez pas encore de demandes de congés.
          </p>
          <Link to="/request-leave">
            <Button>Créer une demande</Button>
          </Link>
        </GlassPanel>
      )}
    </div>
  );
};

export default Dashboard;
