import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X, Plus, AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface FormData {
  email: string;
  name: string;
  bio: string;
  expertise: string[];
}

const API_BASE = "http://localhost:5000/api/auth";

const InstructorRole: React.FC = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    name: "",
    bio: "",
    expertise: [],
  });
  const [expertiseInput, setExpertiseInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    
    if (words <= 200) {
      setFormData((prev) => ({ ...prev, bio: text }));
      setWordCount(words);
    }
  };

  const addExpertise = () => {
    const trimmedInput = expertiseInput.trim();
    
    if (!trimmedInput) return;
    
    if (formData.expertise.includes(trimmedInput)) {
      toast({
        title: "Duplicate Expertise",
        description: "This skill is already added.",
        variant: "destructive",
      });
      return;
    }
    
    setFormData((prev) => ({
      ...prev,
      expertise: [...prev.expertise, trimmedInput],
    }));
    setExpertiseInput("");
  };

  const handleExpertiseKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addExpertise();
    }
  };

  const removeExpertise = (item: string) => {
    setFormData((prev) => ({
      ...prev,
      expertise: prev.expertise.filter((exp) => exp !== item),
    }));
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async () => {
    // Validate email format
    if (!validateEmail(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please provide a valid email address.",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.name.trim()) {
      toast({
        title: "Missing Name",
        description: "Please provide your name.",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.bio.trim()) {
      toast({
        title: "Missing Bio",
        description: "Please provide a bio.",
        variant: "destructive",
      });
      return;
    }
    
    if (formData.expertise.length === 0) {
      toast({
        title: "Missing Expertise",
        description: "Please add at least one area of expertise.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE}/request-instructor-upgrade`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        toast({
          title: "Request Submitted",
          description: "Your instructor upgrade request has been sent to the admin for approval.",
        });
        setFormData({ email: "", name: "", bio: "", expertise: [] });
        setWordCount(0);
      } else {
        throw new Error(data.message || "Failed to submit upgrade request");
      }
    } catch (error) {
      console.error("Upgrade request error:", error);
      toast({
        title: "Request Error",
        description: error instanceof Error ? error.message : "Failed to submit instructor upgrade request.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-8">
      <Card className="w-full max-w-2xl ">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl text-gray-900">
            Request Instructor Role
          </CardTitle>
          <CardDescription className="text-gray-600">
            Submit your details to request an upgrade to instructor role
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 font-medium">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              className="bg-gray-100 border-gray-200 focus:bg-white transition-colors"
              disabled={isSubmitting}
            />
            {formData.email && !validateEmail(formData.email) && (
              <div className="flex items-center text-red-500 text-sm mt-1">
                <AlertCircle className="h-4 w-4 mr-1" />
                Please enter a valid email address
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700 font-medium">
              Full Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              className="bg-gray-100 border-gray-200 focus:bg-white transition-colors"
              disabled={isSubmitting}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="bio" className="text-gray-700 font-medium">
                Bio <span className="text-red-500">*</span>
              </Label>
              <span className={`text-xs ${wordCount > 180 ? 'text-amber-600' : 'text-gray-500'}`}>
                {wordCount}/200 words
              </span>
            </div>
            <Textarea
              id="bio"
              placeholder="Tell us about yourself and your teaching experience (max 200 words)"
              value={formData.bio}
              onChange={handleBioChange}
              className="min-h-[120px] bg-gray-100 border-gray-200 focus:bg-white transition-colors resize-none"
              disabled={isSubmitting}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="expertise" className="text-gray-700 font-medium">
              Areas of Expertise <span className="text-red-500">*</span>
            </Label>
            <div className="flex gap-2">
              <Input
                id="expertise"
                type="text"
                placeholder="Add your skills (e.g., JavaScript, Python)"
                value={expertiseInput}
                onChange={(e) => setExpertiseInput(e.target.value)}
                onKeyPress={handleExpertiseKeyPress}
                className="bg-gray-100 border-gray-200 focus:bg-white transition-colors"
                disabled={isSubmitting}
              />
              <Button
                type="button"
                onClick={addExpertise}
                variant="outline"
                size="icon"
                className="border-gray-300 text-gray-600 hover:bg-gray-100"
                disabled={isSubmitting || !expertiseInput.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Press Enter or click the + button to add each expertise
            </p>
            
            {formData.expertise.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.expertise.map((item, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-3 py-1 flex items-center gap-1"
                  >
                    {item}
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-blue-900"
                      onClick={() => !isSubmitting && removeExpertise(item)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          <Button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 font-medium transition-all"
            disabled={isSubmitting || 
              !validateEmail(formData.email) || 
              !formData.name.trim() || 
              !formData.bio.trim() || 
              formData.expertise.length === 0}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Submitting...
              </>
            ) : (
              "Submit Request"
            )}
          </Button>
          
          <div className="text-xs text-gray-500 text-center pt-2">
            Your request will be reviewed by our admin team. You'll receive an email notification once a decision has been made.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InstructorRole;