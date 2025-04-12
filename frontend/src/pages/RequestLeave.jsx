import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import GlassPanel from "../components/GlassPanel";
import Button from "../components/Button";
import Badge from "../components/Badge";
import useLeaveStore from "../store/useLeaveStore";

const RequestLeave = ({ user }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: "annual",
    startDate: "",
    endDate: "",
    reason: "",
  });
  const { submitLeaveRequest, isLoading } = useLeaveStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.startDate || !formData.endDate) {
      toast.error("Veuillez sélectionner les dates de début et de fin");
      return;
    }

    // Check that end date is not before start date
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      toast.error(
        "La date de fin ne peut pas être antérieure à la date de début"
      );
      return;
    }

    const days = calculateDays(); // Calculate days for the request

    try {
      await submitLeaveRequest(
        {
          type: formData.type,
          startDate: formData.startDate,
          endDate: formData.endDate,
          days,
          reason: formData.reason,
        },
        user.token
      );
      navigate("/dashboard");
    } catch (error) {
      console.error("Error submitting leave request:", error);
    }
  };

  // Calculate number of days
  const calculateDays = () => {
    if (!formData.startDate || !formData.endDate) return 0;

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    return diffDays;
  };

  // Display leave balance based on type
  const getLeaveBalance = () => {
    if (!user?.leaveBalance) return 0;

    switch (formData.type) {
      case "annual":
        return user.leaveBalance.annual;
      case "sick":
        return user.leaveBalance.sick;
      case "personal":
        return user.leaveBalance.personal;
      default:
        return 0;
    }
  };

  // Check if user has enough leave balance
  const hasEnoughBalance = () => {
    return calculateDays() <= getLeaveBalance();
  };

  return (
    <div className="page-container pt-24">
      <h1 className="page-title">Demande de congé</h1>

      <GlassPanel className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="type"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Type de congé
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              required
            >
              <option value="annual">Congé annuel</option>
              <option value="sick">Congé maladie</option>
              <option value="personal">Congé exceptionnel</option>
              <option value="other">Autre congé</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Date de début
              </label>
              <input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                required
              />
            </div>

            <div>
              <label
                htmlFor="endDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Date de fin
              </label>
              <input
                id="endDate"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                required
              />
            </div>
          </div>
          {formData.type == "personal" && (
            <div>
              <label
                htmlFor="reason"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Motif (optionnel)
              </label>
              <textarea
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="Précisez le motif de votre demande de congé..."
              ></textarea>
            </div>
          )}

          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Jours demandés</p>
                <p className="text-2xl font-semibold">
                  {calculateDays()} jour(s)
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm font-medium">Solde disponible</p>
                <p className="text-2xl font-semibold">
                  {getLeaveBalance()} jour(s)
                </p>
              </div>
            </div>

            {formData.startDate && formData.endDate && !hasEnoughBalance() && (
              <div className="mt-2">
                <Badge variant="rejected">Solde insuffisant</Badge>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/dashboard")}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              loading={isLoading}
              disabled={
                isLoading ||
                (formData.startDate && formData.endDate && !hasEnoughBalance())
              }
            >
              Soumettre la demande
            </Button>
          </div>
        </form>
      </GlassPanel>
    </div>
  );
};

export default RequestLeave;
