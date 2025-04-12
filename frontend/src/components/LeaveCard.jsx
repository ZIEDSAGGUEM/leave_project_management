import React, { useState } from "react";
import { cn } from "@/lib/utils";
import Badge from "./Badge";
import ProfileAvatar from "./ProfileAvatar";
import Button from "./Button";
import { Check, X, Edit } from "lucide-react";

const LeaveCard = ({
  request,
  isAdmin = false,
  onApprove,
  onUpdate,
  onReject,
  className,
  ...props
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refusalReason, setRefusalReason] = useState("");

  // Format date range
  const formatDateRange = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const formatOptions = { day: "numeric", month: "short", year: "numeric" };
    const startStr = startDate.toLocaleDateString("fr-FR", formatOptions);
    const endStr = endDate.toLocaleDateString("fr-FR", formatOptions);

    if (startStr === endStr) return startStr;
    return `${startStr} - ${endStr}`;
  };

  // Calculate number of days
  const getDaysDifference = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <Badge variant="pending">En attente</Badge>;
      case "approved":
        return <Badge variant="approved">Approuvé</Badge>;
      case "rejected":
        return <Badge variant="rejected">Refusé</Badge>;
      default:
        return <Badge>Inconnu</Badge>;
    }
  };

  // Get leave type badge
  const getTypeBadge = (type) => {
    switch (type) {
      case "annual":
        return <Badge variant="annual">Congé annuel</Badge>;
      case "sick":
        return <Badge variant="sick">Congé maladie</Badge>;
      case "personal":
        return <Badge variant="special">Congé exceptionnel</Badge>;
      case "other":
        return <Badge variant="other">Autre congé</Badge>;
      default:
        return <Badge>Congé</Badge>;
    }
  };

  const handleReject = () => {
    onReject(request.id, refusalReason);
    setIsModalOpen(false);
    setRefusalReason("");
  };

  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-5 shadow-sm hover:shadow transition-all animate-scale-in",
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <ProfileAvatar name={request.user.name} />
          <div>
            <h3 className="font-medium">{request.user.name}</h3>
            <p className="text-sm text-muted-foreground">
              {formatDateRange(request.startDate, request.endDate)}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {getTypeBadge(request.type)}
              {getStatusBadge(request.status)}
              <Badge size="sm">
                {getDaysDifference(request.startDate, request.endDate)} jour(s)
              </Badge>
            </div>
          </div>
        </div>

        {request.status === "pending" && isAdmin && (
          <div className="flex space-x-2">
            <Button
              variant="success"
              size="sm"
              onClick={() => onApprove(request.id)}
            >
              Approuver
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onReject(request.id)}
            >
              Refuser
            </Button>
          </div>
        )}
      </div>

      {(request.status === "approved" || request.status === "rejected") &&
        isAdmin && (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onUpdate(request.id)}
              className="bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
            >
              <Edit className="w-4 h-4 mr-1" /> Modifier
            </Button>
          </div>
        )}

      {request.reason && (
        <div className="mt-4 text-sm">
          <p className="font-medium">Motif de demande :</p>
          <p className="text-muted-foreground">{request.reason}</p>
        </div>
      )}
      {request.status === "rejected" && request.reasonRefuse && (
        <div className="mt-4 text-sm bg-red-50 p-3 rounded-md border border-red-100">
          <p className="font-medium text-red-700">Motif de refus :</p>
          <p className="text-red-600">{request.reasonRefuse}</p>
        </div>
      )}
    </div>
  );
};

export default LeaveCard;
