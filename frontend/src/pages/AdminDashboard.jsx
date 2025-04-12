import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import GlassPanel from "../components/GlassPanel";
import LeaveCard from "../components/LeaveCard";
import Badge from "../components/Badge";
import RejectLeaveModal from "./RejectLeaveModal";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "../components/ui/alert-dialog";
import { Check, X, RefreshCw } from "lucide-react";
import io from "socket.io-client";
import useLeaveStore from "../store/useLeaveStore";

const socket = io("http://localhost:5000");

const AdminDashboard = ({ user }) => {
  const { leaveRequests, isLoading, fetchAllLeaves, updateLeaveStatus, resetLeaveStatus } = useLeaveStore();
  const [filter, setFilter] = useState("all");
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedLeaveId, setSelectedLeaveId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);

  useEffect(() => {
    fetchAllLeaves(user.token);
  }, [user.token, fetchAllLeaves]);

  const handleApprove = async (id) => {
    try {
      await updateLeaveStatus(id, "approved", user.token);

      // Listen for socket notification
      socket.on("newNotification", (notification) => {
        toast.info(notification.message);
      });
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };

  const handleRejectClick = (id) => {
    setSelectedLeaveId(id);
    setRejectModalOpen(true);
    setErrorMessage("");
  };

  const handleReject = async (id, reasonRefuse) => {
    try {
      await updateLeaveStatus(id, "rejected", user.token, reasonRefuse);

      // Listen for socket notification
      socket.on("newNotification", (notification) => {
        toast.info(notification.message);
      });

      setRejectModalOpen(false);
    } catch (error) {
      console.error("Error rejecting request:", error);
      setErrorMessage("Erreur lors du refus de la demande");
    }
  };

  const handleUpdateClick = (leave) => {
    setSelectedLeave(leave);
    setUpdateDialogOpen(true);
  };

  const handleUpdateStatus = async (newStatus, reasonRefuse) => {
    try {
      await updateLeaveStatus(selectedLeave._id, newStatus, user.token, reasonRefuse);

      // Listen for socket notification
      socket.on("newNotification", (notification) => {
        toast.info(notification.message);
      });

      setUpdateDialogOpen(false);
      setSelectedLeave(null);
    } catch (error) {
      console.error("Error updating request status:", error);
    }
  };

  const handleResetStatus = async () => {
    try {
      await resetLeaveStatus(selectedLeave._id, user.token);

      setUpdateDialogOpen(false);
      setSelectedLeave(null);
    } catch (error) {
      console.error("Error resetting request status:", error);
    }
  };

  // Filter requests based on selected filter
  const filteredRequests = () => {
    if (filter === "all") return leaveRequests;
    return leaveRequests.filter((req) => req.status === filter);
  };

  // Count requests by status
  const getStatusCounts = () => {
    return {
      all: leaveRequests.length,
      pending: leaveRequests.filter((req) => req.status === "pending").length,
      approved: leaveRequests.filter((req) => req.status === "approved").length,
      rejected: leaveRequests.filter((req) => req.status === "rejected").length,
    };
  };

  const counts = getStatusCounts();

  return (
    <div className="page-container pt-24">
      <h1 className="page-title">Administration des congés</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <GlassPanel
          className={`animate-fade-in cursor-pointer hover:bg-white/60 transition-all ${
            filter === "all" ? "ring-2 ring-primary ring-inset" : ""
          }`}
          onClick={() => setFilter("all")}
          style={{ animationDelay: "0.1s" }}
        >
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Toutes les demandes
          </h3>
          <div className="text-3xl font-semibold">{counts.all}</div>
          <Badge className="mt-2">Total</Badge>
        </GlassPanel>

        <GlassPanel
          className={`animate-fade-in cursor-pointer hover:bg-white/60 transition-all ${
            filter === "pending" ? "ring-2 ring-primary ring-inset" : ""
          }`}
          onClick={() => setFilter("pending")}
          style={{ animationDelay: "0.2s" }}
        >
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            En attente
          </h3>
          <div className="text-3xl font-semibold">{counts.pending}</div>
          <Badge variant="pending" className="mt-2">
            À traiter
          </Badge>
        </GlassPanel>

        <GlassPanel
          className={`animate-fade-in cursor-pointer hover:bg-white/60 transition-all ${
            filter === "approved" ? "ring-2 ring-primary ring-inset" : ""
          }`}
          onClick={() => setFilter("approved")}
          style={{ animationDelay: "0.3s" }}
        >
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Approuvées
          </h3>
          <div className="text-3xl font-semibold">{counts.approved}</div>
          <Badge variant="approved" className="mt-2">
            Validées
          </Badge>
        </GlassPanel>

        <GlassPanel
          className={`animate-fade-in cursor-pointer hover:bg-white/60 transition-all ${
            filter === "rejected" ? "ring-2 ring-primary ring-inset" : ""
          }`}
          onClick={() => setFilter("rejected")}
          style={{ animationDelay: "0.4s" }}
        >
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Refusées
          </h3>
          <div className="text-3xl font-semibold">{counts.rejected}</div>
          <Badge variant="rejected" className="mt-2">
            Rejetées
          </Badge>
        </GlassPanel>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          {filter === "all"
            ? "Toutes les demandes"
            : filter === "pending"
            ? "Demandes en attente"
            : filter === "approved"
            ? "Demandes approuvées"
            : "Demandes refusées"}
        </h2>
        <p className="text-muted-foreground">
          {filter === "pending" &&
            "Ces demandes sont en attente de votre validation."}
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-pulse-soft">Chargement des demandes...</div>
        </div>
      ) : filteredRequests().length > 0 ? (
        <div className="space-y-4">
          {filteredRequests().map((request, index) => (
            <LeaveCard
              key={request._id}
              request={request}
              isAdmin={true}
              onApprove={() => handleApprove(request._id)}
              onReject={() => handleRejectClick(request._id)}
              onUpdate={() => handleUpdateClick(request)}
              style={{ animationDelay: `${0.1 * index}s` }}
            />
          ))}
        </div>
      ) : (
        <GlassPanel className="text-center py-8">
          <p className="text-muted-foreground">
            {filter === "all"
              ? "Aucune demande de congé trouvée."
              : filter === "pending"
              ? "Aucune demande en attente pour le moment."
              : filter === "approved"
              ? "Aucune demande approuvée pour le moment."
              : "Aucune demande refusée pour le moment."}
          </p>
        </GlassPanel>
      )}
      <RejectLeaveModal
        open={rejectModalOpen}
        onOpenChange={setRejectModalOpen}
        onReject={handleReject}
        leaveId={selectedLeaveId}
        errorMessage={errorMessage}
      />
      {/* Status Update Dialog */}
      <AlertDialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Modifier le statut de la demande
            </AlertDialogTitle>
            <AlertDialogDescription>
              Choisissez une action pour cette demande de congé.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="flex flex-col space-y-3 py-3">
            {selectedLeave?.status === "approved" ? (
              <div className="p-2 bg-green-50 rounded-md border border-green-100 text-green-700 text-sm">
                Cette demande est actuellement approuvée.
              </div>
            ) : selectedLeave?.status === "rejected" ? (
              <div className="p-2 bg-red-50 rounded-md border border-red-100 text-red-700 text-sm">
                Cette demande est actuellement refusée.
              </div>
            ) : null}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>

            {selectedLeave?.status === "approved" ? (
              <>
                <AlertDialogAction
                  className="bg-red-500 hover:bg-red-600"
                  onClick={() => handleRejectClick(selectedLeave?._id)}
                >
                  <X className="w-4 h-4 mr-1" /> Refuser
                </AlertDialogAction>
                <AlertDialogAction
                  className="bg-slate-500 hover:bg-slate-600"
                  onClick={handleResetStatus}
                >
                  <RefreshCw className="w-4 h-4 mr-1" /> Remettre en attente
                </AlertDialogAction>
              </>
            ) : selectedLeave?.status === "rejected" ? (
              <>
                <AlertDialogAction
                  className="bg-green-500 hover:bg-green-600"
                  onClick={() =>
                    handleUpdateStatus("approved", selectedLeave?.reasonRefuse)
                  }
                >
                  <Check className="w-4 h-4 mr-1" /> Approuver
                </AlertDialogAction>
                <AlertDialogAction
                  className="bg-slate-500 hover:bg-slate-600"
                  onClick={handleResetStatus}
                >
                  <RefreshCw className="w-4 h-4 mr-1" /> Remettre en attente
                </AlertDialogAction>
              </>
            ) : null}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminDashboard;
