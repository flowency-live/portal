import { useParams, useLocation } from "wouter";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "../lib/services/api-service";

interface InviteDetails {
  token: string;
  clientId: string;
  clientName: string;
  status: string;
  expiresAt: number;
}

export default function Invite() {
  const { token } = useParams();
  const [, setLocation] = useLocation();

  // Store invite token in localStorage on mount
  useEffect(() => {
    if (token) {
      localStorage.setItem('flowency-token', token);
    }
  }, [token]);

  // Fetch invite details
  const { data: inviteDetails, isLoading, error } = useQuery<InviteDetails>({
    queryKey: ['/api/flowency-invites', token],
    queryFn: () => apiService.validateInvite(token!),
    enabled: !!token,
    retry: false
  });

  // Auto-redirect to PRD page on successful validation
  useEffect(() => {
    if (inviteDetails && inviteDetails.status === 'active') {
      localStorage.setItem('flowency-client-id', inviteDetails.clientId);
      localStorage.setItem('flowency-client-name', inviteDetails.clientName);

      setTimeout(() => {
        setLocation('/prd');
      }, 1500);
    }
  }, [inviteDetails, setLocation]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-flowency-blue to-flowency-dark p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Validating your invitation...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !inviteDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-flowency-blue to-flowency-dark p-4 flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Invitation Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              This invitation may have expired or is no longer valid.
            </p>
            <a
              href="https://www.flowency.co.uk"
              className="inline-block bg-flowency-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition"
            >
              Go to Flowency
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  return (
    <div className="min-h-screen bg-gradient-to-br from-flowency-blue to-flowency-dark p-4 flex items-center justify-center">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Welcome, {inviteDetails.clientName}!
          </h1>
          <p className="text-gray-600 mb-6">
            Your invitation has been validated. Taking you to your PRD document...
          </p>
          <div className="animate-pulse text-flowency-blue font-semibold">
            Loading your workspace...
          </div>
        </div>
      </div>
    </div>
  );
}
