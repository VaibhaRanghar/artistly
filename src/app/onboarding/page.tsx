"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { Checkbox } from "@/src/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Progress } from "@/src/components/ui/progress";
import { ArrowLeft, ArrowRight, CheckCircle, Upload } from "lucide-react";
import { useArtist } from "@/src/contexts/artist-context";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

const categories = ["Singers", "Dancers", "Speakers", "DJs"];
const languages = [
  "English",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Portuguese",
  "Mandarin",
  "Japanese",
  "Korean",
  "Arabic",
  "Hindi",
  "Russian",
];
const feeRanges = [
  "$100-300",
  "$300-500",
  "$500-800",
  "$800-1200",
  "$1200-2000",
  "$2000+",
];

interface FormData {
  name: string;
  bio: string;
  location: string;
  city: string;
  categories: string[];
  languages: string[];
  feeRange: string;
  profileImage: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    bio: "",
    location: "",
    city: "",
    categories: [],
    languages: [],
    feeRange: "",
    profileImage: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const { addArtist } = useArtist();
  const router = useRouter();

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};

    switch (step) {
      case 1:
        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.bio.trim()) newErrors.bio = "Bio is required";
        if (!formData.location.trim())
          newErrors.location = "Location is required";
        break;
      case 2:
        if (formData.categories.length === 0)
          newErrors.categories = "Select at least one category";
        break;
      case 3:
        if (formData.languages.length === 0)
          newErrors.languages = "Select at least one language";
        break;
      case 4:
        if (!formData.feeRange) newErrors.feeRange = "Fee range is required";
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      const cityFromLocation = formData.location.split(",")[0].trim();
      addArtist({
        ...formData,
        city: cityFromLocation,
      });
      setIsSubmitted(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    }
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      categories: checked
        ? [...prev.categories, category]
        : prev.categories.filter((c) => c !== category),
    }));
  };

  const handleLanguageChange = (language: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      languages: checked
        ? [...prev.languages, language]
        : prev.languages.filter((l) => l !== language),
    }));
  };

  if (isSubmitted) {
    return (
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md mx-auto text-center"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Welcome to Artistly!</h2>
          <p className="text-muted-foreground mb-4">
            Your profile has been created successfully. Redirecting to
            dashboard...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Join as an Artist</h1>
          <p className="text-muted-foreground">
            Create your profile and start getting booked for events
          </p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(progress)}% complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {currentStep === 1 && "Basic Information"}
              {currentStep === 2 && "Categories"}
              {currentStep === 3 && "Languages"}
              {currentStep === 4 && "Pricing & Profile"}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Tell us about yourself and your location"}
              {currentStep === 2 &&
                "Select the categories that best describe your talents"}
              {currentStep === 3 && "What languages do you speak?"}
              {currentStep === 4 &&
                "Set your fee range and upload a profile image"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className={errors.name ? "border-red-500" : ""}
                      />
                      {errors.name && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="bio">Bio *</Label>
                      <Textarea
                        id="bio"
                        placeholder="Tell us about your experience and what makes you unique..."
                        value={formData.bio}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            bio: e.target.value,
                          }))
                        }
                        className={errors.bio ? "border-red-500" : ""}
                        rows={4}
                      />
                      {errors.bio && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.bio}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="location">Location *</Label>
                      <Input
                        id="location"
                        placeholder="City, State"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            location: e.target.value,
                          }))
                        }
                        className={errors.location ? "border-red-500" : ""}
                      />
                      {errors.location && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.location}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div>
                      <Label>Select Categories *</Label>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        {categories.map((category) => (
                          <div
                            key={category}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={category}
                              checked={formData.categories.includes(category)}
                              onCheckedChange={(checked) =>
                                handleCategoryChange(
                                  category,
                                  checked as boolean
                                )
                              }
                            />
                            <Label htmlFor={category}>{category}</Label>
                          </div>
                        ))}
                      </div>
                      {errors.categories && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.categories}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div>
                      <Label>Languages Spoken *</Label>
                      <div className="grid grid-cols-2 gap-4 mt-2 max-h-60 overflow-y-auto">
                        {languages.map((language) => (
                          <div
                            key={language}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={language}
                              checked={formData.languages.includes(language)}
                              onCheckedChange={(checked) =>
                                handleLanguageChange(
                                  language,
                                  checked as boolean
                                )
                              }
                            />
                            <Label htmlFor={language}>{language}</Label>
                          </div>
                        ))}
                      </div>
                      {errors.languages && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.languages}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="feeRange">Fee Range *</Label>
                      <Select
                        value={formData.feeRange}
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, feeRange: value }))
                        }
                      >
                        <SelectTrigger
                          className={errors.feeRange ? "border-red-500" : ""}
                        >
                          <SelectValue placeholder="Select your fee range" />
                        </SelectTrigger>
                        <SelectContent>
                          {feeRanges.map((range) => (
                            <SelectItem key={range} value={range}>
                              {range}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.feeRange && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.feeRange}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="profileImage">Profile Image</Label>
                      {formData.profileImage ? (
                        <p>Profile photo uploaded</p>
                      ) : (
                        <div className="mt-2 flex items-center justify-center w-full">
                          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">
                                Click to upload image
                              </p>
                            </div>
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  profileImage: e.target.value,
                                }))
                              }
                            />
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              {currentStep < totalSteps ? (
                <Button onClick={handleNext}>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmit}>Submit Application</Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
