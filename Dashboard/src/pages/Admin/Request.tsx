import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ChevronDown, ChevronUp, User, Mail, BookOpen, Check, X, Clock, AlertCircle } from "lucide-react";

interface UpgradeRequest {
  _id: string;
  studentId: { name: string; email: string };
  email: string;
  name: string;
  bio: string;
  expertise: string[];
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

const API_BASE = `${import.meta.env.VITE_API_URL}/api/auth`;

const AdminInstructorApproval: React.FC = () => {
  const { user, token } = useAuth();
  const { toast } = useToast();
  const [requests, setRequests] = useState<UpgradeRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedRequestId, setExpandedRequestId] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      if (!user || (user.role !== "admin" && user.role !== "subadmin")) {
        console.log("User not authorized:", user);
        setIsLoading(false);
        return;
      }
      try {
        console.log("Fetching pending upgrade requests with token:", token);
        const response = await fetch(`${API_BASE}/pending-upgrade-requests`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        console.log("Pending requests response:", data);
        if (response.ok) {
          setRequests(data);
        } else {
          throw new Error(data.message || "Failed to fetch requests");
        }
      } catch (error) {
        console.error("Fetch requests error:", error);
        toast({
          title: "Error",
          description: "Failed to load pending upgrade requests.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, [user, token, toast]);

  const handleAction = async (requestId: string, action: "approved" | "rejected") => {
    try {
      console.log(`Sending ${action} request for ID:`, requestId);
      const response = await fetch(`${API_BASE}/manage-instructor-upgrade`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requestId, action }),
      });
      const data = await response.json();
      console.log(`${action} response:`, data);
      if (response.ok) {
        setRequests((prev) => prev.filter((r) => r._id !== requestId));
        setExpandedRequestId(null);
        toast({
          title: `${action.charAt(0).toUpperCase() + action.slice(1)}`,
          description: `Instructor request ${action} successfully.`,
        });
      } else {
        throw new Error(data.message || `Failed to ${action} request`);
      }
    } catch (error) {
      console.error(`${action} error:`, error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : `Failed to ${action} request.`,
        variant: "destructive",
      });
    }
  };

  const toggleExpand = (requestId: string) => {
    if (expandedRequestId === requestId) {
      setExpandedRequestId(null);
    } else {
      setExpandedRequestId(requestId);
    }
  };

  if (user?.role !== "admin" && user?.role !== "subadmin") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto bg-red-100 p-3 rounded-full">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl">Access Denied</CardTitle>
            <CardDescription>Only administrators can view this page.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="text-lg font-medium">Loading requests...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div>
        <Card className="rounded-xl border-2 border-gray-100">
          <CardContent className="p-0">
            {requests.length === 0 ? (
              <div className="text-center py-12 px-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4">
                  <Check className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">All caught up!</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  There are no pending instructor upgrade requests at this time.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {requests.map((request) => (
                  <div key={request._id} className="p-4 md:p-6 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <div className="p-2 rounded-full mr-3">
                            <User className="h-5 w-5 text-gray-900" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900">New Instructor Request</h3>
                          <Badge variant="outline" className="ml-3 bg-amber-100 text-amber-800 border-amber-200">
                            <Clock className="h-3 w-3 mr-1" /> Pending
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 mt-1 ml-10">
                          Received {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpand(request._id)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        {expandedRequestId === request._id ? (
                          <>
                            <span className="sr-only">Collapse</span>
                            <ChevronUp className="h-4 w-4" />
                          </>
                        ) : (
                          <>
                            <span className="sr-only">Expand</span>
                            <ChevronDown className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>

                    {expandedRequestId === request._id && (
                      <div className="mt-4 ml-10 space-y-4 animate-in fade-in duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-start">
                            <User className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-gray-800">Name</p>
                              <p className="text-gray-900">{request.name}</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <Mail className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-gray-800">Email</p>
                              <p className="text-gray-900">{request.email}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <BookOpen className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-800">Bio</p>
                            <p className="text-gray-900">{request.bio}</p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <BookOpen className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-800 mb-1">Expertise</p>
                            <div className="flex flex-wrap gap-2">
                              {request.expertise.map((exp, index) => (
                                <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                                  {exp}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                          <Button
                            onClick={() => handleAction(request._id, "rejected")}
                            variant="outline"
                            className="border-red-300 text-red-700 hover:bg-red-50"
                          >
                            <X className="h-4 w-4 mr-2" /> Reject
                          </Button>
                          <Button
                            onClick={() => handleAction(request._id, "approved")}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Check className="h-4 w-4 mr-2" /> Approve
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminInstructorApproval;