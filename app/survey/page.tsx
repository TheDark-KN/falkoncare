"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useMutation, useQuery, useConvexAuth } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

import SurveyInformationSection from "./components/SurveyInformationSection";
import HouseInformationSection from "./components/HouseInformationSection";
import CustomerDetailsSection from "./components/CustomerDetailsSection";
import WaterTankDetailsSection from "./components/WaterTankDetailsSection";
import TankHealthCheckSection from "./components/TankHealthCheckSection";
import PhotoDocumentationSection from "./components/PhotoDocumentationSection";
import CustomerResponseSection from "./components/CustomerResponseSection";
import SurveyorRemarksSection from "./components/SurveyorRemarksSection";
import DeclarationSection from "./components/DeclarationSection";
import { ErrorBoundary } from "@/components/shared/error-boundary";
import { ConvexStatusBanner } from "@/components/shared/convex-status-banner";

import type {
  SurveyFormData,
  SurveySubmissionPayload,
  LeadPriority,
  SectionStatus,
  SocietyOption,
} from "@/types/survey";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Default form state factory
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function getDefaultFormData(surveyorName: string, surveyorId: string): SurveyFormData {
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return {
    surveyInformation: {
      surveyDate: dateStr,
      surveyorName,
      surveyorId,
      societyArea: "",
      gpsCoordinates: null,
    },
    houseInformation: {
      houseFlatNumber: "",
      floor: "",
    },
    customerDetails: {
      mobileNumber: "",
      customerName: "",
      emailId: "",
    },
    waterTankDetails: {
      tankType: "",
      tankMaterials: [],
      otherMaterial: "",
      totalTanks: "",
      tankCapacity: "",
      totalWaterStorage: 0,
      lastCleaning: "",
    },
    tankHealthCheck: {
      isDirty: null,
      isLidBroken: null,
      isDamaged: null,
      isMosquitoPresent: null,
      waterCondition: "",
    },
    photoDocumentation: {
      photos: [],
      photoCategories: [],
      customerConsent: null,
    },
    customerResponse: {
      customerDecision: "",
      servicesRequired: [],
      preferredServiceDate: "",
      leadPriority: "Cold Lead",
    },
    surveyorRemarks: {
      remarks: "",
    },
    declaration: {
      accepted: false,
      signatureName: surveyorName,
      declarationDate: dateStr,
    },
  };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Lead Priority auto-suggestion
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function calculateLeadPriority(
  isDirty: boolean | null,
  isDamaged: boolean | null,
  lastCleaning: string
): LeadPriority {
  const isHot =
    isDirty === true ||
    isDamaged === true ||
    lastCleaning === "Never Cleaned";

  if (isHot) return "Hot Lead";

  const isWarm =
    lastCleaning === "6–12 Months Ago" ||
    lastCleaning === "More Than 1 Year Ago";

  if (isWarm) return "Warm Lead";

  return "Cold Lead";
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Section completion checker
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function getSectionStatuses(form: SurveyFormData): SectionStatus[] {
  return [
    {
      id: 1,
      title: "Survey Information",
      isComplete:
        form.surveyInformation.surveyDate !== "" &&
        form.surveyInformation.surveyorName !== "" &&
        form.surveyInformation.societyArea !== "",
    },
    {
      id: 2,
      title: "House Information",
      isComplete:
        form.houseInformation.houseFlatNumber !== "" &&
        form.houseInformation.floor !== "",
    },
    {
      id: 3,
      title: "Customer Details",
      isComplete:
        /^[6-9]\d{9}$/.test(form.customerDetails.mobileNumber) &&
        form.customerDetails.customerName !== "",
    },
    {
      id: 4,
      title: "Water Tank Details",
      isComplete:
        form.waterTankDetails.tankType !== "" &&
        form.waterTankDetails.tankMaterials.length > 0 &&
        form.waterTankDetails.totalTanks !== "" &&
        form.waterTankDetails.tankCapacity !== "" &&
        form.waterTankDetails.lastCleaning !== "",
    },
    {
      id: 5,
      title: "Tank Health Check",
      isComplete:
        form.tankHealthCheck.isDirty !== null &&
        form.tankHealthCheck.isLidBroken !== null &&
        form.tankHealthCheck.isDamaged !== null &&
        form.tankHealthCheck.isMosquitoPresent !== null &&
        form.tankHealthCheck.waterCondition !== "",
    },
    {
      id: 6,
      title: "Photo Documentation",
      isComplete: form.photoDocumentation.customerConsent !== null,
    },
    {
      id: 7,
      title: "Customer Response",
      isComplete:
        form.customerResponse.customerDecision !== "" &&
        form.customerResponse.servicesRequired.length > 0,
    },
    {
      id: 8,
      title: "Surveyor Remarks",
      isComplete: true,
    },
    {
      id: 9,
      title: "Declaration",
      isComplete:
        form.declaration.accepted &&
        form.declaration.signatureName !== "",
    },
  ];
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Offline queue helper
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function saveToOfflineQueue(payload: SurveySubmissionPayload) {
  try {
    const queue = JSON.parse(localStorage.getItem("falkon-survey-queue") || "[]");
    queue.push(payload);
    localStorage.setItem("falkon-survey-queue", JSON.stringify(queue));
  } catch {
    // localStorage may be full or unavailable
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Stagger animation variants
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

const successVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] as const },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: { duration: 0.3 },
  },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Main Survey Page
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function SurveyPageContent() {
  const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth();
  const router = useRouter();
  const user = useQuery(api.users.current);
  const isLoaded = user !== undefined;
  const submitSurvey = useMutation(api.surveys.submitSurvey);
  const generateUploadUrl = useMutation(api.surveys.generateUploadUrl);

  // Redirect if not signed in or not registered in users table
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      toast.error("Please sign in first.");
      router.push("/signin?redirect_url=/survey");
    } else if (!isAuthLoading && isAuthenticated && user === null) {
      toast.error("Account not registered. Please sign up first.");
      router.push("/signup");
    }
  }, [isAuthLoading, isAuthenticated, user, router]);


  // Gracefully handle the case where the Convex backend has not been
  // deployed yet. The query throws "Could not find public function" in
  // that case, and we want the page itself (not the error boundary) to
  // still render so the surveyor can finish the form.
  const societiesResult = useQuery(api.surveys.getSocieties);
  const societies: SocietyOption[] =
    (societiesResult as SocietyOption[] | undefined) ?? [];

  const surveyorName = user?.name ?? user?.fullName ?? "Surveyor";
  const surveyorId = user?._id ?? "";

  const [formData, setFormData] = useState<SurveyFormData>(
    getDefaultFormData(surveyorName, surveyorId)
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<{
    customerName: string;
    address: string;
    leadPriority: string;
  } | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sync surveyor info when user loads
  useEffect(() => {
    if (isLoaded && user) {
      setFormData((prev) => ({
        ...prev,
        surveyInformation: {
          ...prev.surveyInformation,
          surveyorName: user.name ?? user.fullName ?? "Surveyor",
          surveyorId: user._id,
        },
        declaration: {
          ...prev.declaration,
          signatureName: user.name ?? user.fullName ?? "Surveyor",
        },
      }));
    }
  }, [isLoaded, user]);

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    setIsOnline(navigator.onLine);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Auto-suggest lead priority whenever health check or tank details change
  useEffect(() => {
    const suggested = calculateLeadPriority(
      formData.tankHealthCheck.isDirty,
      formData.tankHealthCheck.isDamaged,
      formData.waterTankDetails.lastCleaning
    );
    setFormData((prev) => ({
      ...prev,
      customerResponse: {
        ...prev.customerResponse,
        leadPriority: suggested,
      },
    }));
  }, [
    formData.tankHealthCheck.isDirty,
    formData.tankHealthCheck.isDamaged,
    formData.waterTankDetails.lastCleaning,
  ]);

  // Section statuses
  const sectionStatuses = useMemo(
    () => getSectionStatuses(formData),
    [formData]
  );
  const completedSections = sectionStatuses.filter((s) => s.isComplete).length;
  const progressPercent = Math.round((completedSections / 9) * 100);

  // Check if all required fields are filled
  const isFormValid = useMemo(() => {
    const mobileValid = /^[6-9]\d{9}$/.test(formData.customerDetails.mobileNumber);
    return (
      formData.surveyInformation.societyArea !== "" &&
      formData.houseInformation.houseFlatNumber !== "" &&
      formData.houseInformation.floor !== "" &&
      mobileValid &&
      formData.waterTankDetails.tankType !== "" &&
      formData.waterTankDetails.tankMaterials.length > 0 &&
      formData.waterTankDetails.totalTanks !== "" &&
      formData.waterTankDetails.tankCapacity !== "" &&
      formData.waterTankDetails.lastCleaning !== "" &&
      formData.tankHealthCheck.isDirty !== null &&
      formData.tankHealthCheck.isLidBroken !== null &&
      formData.tankHealthCheck.isDamaged !== null &&
      formData.tankHealthCheck.isMosquitoPresent !== null &&
      formData.tankHealthCheck.waterCondition !== "" &&
      formData.customerResponse.customerDecision !== "" &&
      formData.customerResponse.servicesRequired.length > 0 &&
      formData.declaration.accepted &&
      formData.declaration.signatureName !== ""
    );
  }, [formData]);

  // Field-level validation
  const validateField = useCallback(
    (field: string, value: string) => {
      const newErrors = { ...errors };
      if (field === "mobileNumber") {
        if (value && !/^[6-9]\d{9}$/.test(value)) {
          newErrors.mobileNumber = "Enter a valid 10-digit mobile number starting with 6-9";
        } else {
          delete newErrors.mobileNumber;
        }
      }
      if (field === "emailId") {
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.emailId = "Enter a valid email address";
        } else {
          delete newErrors.emailId;
        }
      }
      setErrors(newErrors);
    },
    [errors]
  );

  // Section update handlers
  const updateSurveyInformation = useCallback(
    (data: SurveyFormData["surveyInformation"]) => {
      setFormData((prev) => ({ ...prev, surveyInformation: data }));
    },
    []
  );

  const updateHouseInformation = useCallback(
    (data: SurveyFormData["houseInformation"]) => {
      setFormData((prev) => ({ ...prev, houseInformation: data }));
    },
    []
  );

  const updateCustomerDetails = useCallback(
    (data: SurveyFormData["customerDetails"]) => {
      setFormData((prev) => ({ ...prev, customerDetails: data }));
      if (data.mobileNumber) validateField("mobileNumber", data.mobileNumber);
      if (data.emailId) validateField("emailId", data.emailId);
    },
    [validateField]
  );

  const updateWaterTankDetails = useCallback(
    (data: SurveyFormData["waterTankDetails"]) => {
      setFormData((prev) => ({ ...prev, waterTankDetails: data }));
    },
    []
  );

  const updateTankHealthCheck = useCallback(
    (data: SurveyFormData["tankHealthCheck"]) => {
      setFormData((prev) => ({ ...prev, tankHealthCheck: data }));
    },
    []
  );

  const updatePhotoDocumentation = useCallback(
    (data: SurveyFormData["photoDocumentation"]) => {
      setFormData((prev) => ({ ...prev, photoDocumentation: data }));
    },
    []
  );

  const updateCustomerResponse = useCallback(
    (data: SurveyFormData["customerResponse"]) => {
      setFormData((prev) => ({ ...prev, customerResponse: data }));
    },
    []
  );

  const updateSurveyorRemarks = useCallback(
    (data: SurveyFormData["surveyorRemarks"]) => {
      setFormData((prev) => ({ ...prev, surveyorRemarks: data }));
    },
    []
  );

  const updateDeclaration = useCallback(
    (data: SurveyFormData["declaration"]) => {
      setFormData((prev) => ({ ...prev, declaration: data }));
    },
    []
  );

  // Build submission payload
  const buildPayload = useCallback((photoStorageIds?: string[]): SurveySubmissionPayload => {
    return {
      surveyorId: formData.surveyInformation.surveyorId,
      surveyorName: formData.surveyInformation.surveyorName,
      surveyDate: formData.surveyInformation.surveyDate,
      societyArea: formData.surveyInformation.societyArea,
      gpsCoordinates: formData.surveyInformation.gpsCoordinates,
      houseFlatNumber: formData.houseInformation.houseFlatNumber,
      floor: formData.houseInformation.floor,
      mobileNumber: formData.customerDetails.mobileNumber,
      customerName: formData.customerDetails.customerName,
      emailId: formData.customerDetails.emailId,
      tankType: formData.waterTankDetails.tankType,
      tankMaterials: formData.waterTankDetails.tankMaterials,
      otherMaterial: formData.waterTankDetails.otherMaterial,
      totalTanks: formData.waterTankDetails.totalTanks,
      tankCapacity: formData.waterTankDetails.tankCapacity,
      totalWaterStorage: formData.waterTankDetails.totalWaterStorage,
      lastCleaning: formData.waterTankDetails.lastCleaning,
      isDirty: formData.tankHealthCheck.isDirty,
      isLidBroken: formData.tankHealthCheck.isLidBroken,
      isDamaged: formData.tankHealthCheck.isDamaged,
      isMosquitoPresent: formData.tankHealthCheck.isMosquitoPresent,
      waterCondition: formData.tankHealthCheck.waterCondition,
      photoCategories: formData.photoDocumentation.photoCategories,
      customerConsent: formData.photoDocumentation.customerConsent,
      numberOfPhotos: formData.photoDocumentation.photos.length,
      photoStorageIds,
      customerDecision: formData.customerResponse.customerDecision,
      servicesRequired: formData.customerResponse.servicesRequired,
      preferredServiceDate: formData.customerResponse.preferredServiceDate,
      leadPriority: formData.customerResponse.leadPriority,
      remarks: formData.surveyorRemarks.remarks,
      declarationAccepted: formData.declaration.accepted,
      signatureName: formData.declaration.signatureName,
      timestamp: Date.now(),
    };
  }, [formData]);

  // Submit handler
  const handleSubmit = useCallback(async () => {
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);

    try {
      if (!isOnline) {
        const offlinePayload = buildPayload();
        saveToOfflineQueue(offlinePayload);
        toast.warning("⚠️ No internet — data saved locally", {
          description: "Survey will be submitted when you're back online.",
        });
        setIsSubmitting(false);
        return;
      }

      // 1. Upload photos to Convex Storage if there are any
      const photoStorageIds: string[] = [];
      const photosToUpload = formData.photoDocumentation.photos;
      if (photosToUpload.length > 0) {
        toast.loading("Uploading photos...", { id: "upload-toast" });
        for (let i = 0; i < photosToUpload.length; i++) {
          const photo = photosToUpload[i];
          
          // Get upload URL
          const uploadUrl = await generateUploadUrl();
          
          // POST to Convex Storage
          const response = await fetch(uploadUrl, {
            method: "POST",
            headers: { "Content-Type": photo.file.type },
            body: photo.file,
          });

          if (!response.ok) {
            toast.dismiss("upload-toast");
            throw new Error(`Failed to upload photo "${photo.file.name}"`);
          }

          const { storageId } = await response.json();
          photoStorageIds.push(storageId);
        }
        toast.dismiss("upload-toast");
      }

      // 2. Build final payload with photo storage IDs
      const payload = buildPayload(photoStorageIds);

      await submitSurvey(payload);

      setSubmittedData({
        customerName: formData.customerDetails.customerName || "Customer",
        address: `${formData.houseInformation.houseFlatNumber}, ${formData.surveyInformation.societyArea}`,
        leadPriority: formData.customerResponse.leadPriority,
      });

      setShowSuccess(true);
      toast.success("✅ Survey Saved", {
        description: "Survey data has been submitted successfully.",
      });

      // Auto-reset after 3 seconds
      setTimeout(() => {
        const keepSurveyor = formData.surveyInformation.surveyorName;
        const keepSurveyorId = formData.surveyInformation.surveyorId;
        const keepSociety = formData.surveyInformation.societyArea;
        const keepGps = formData.surveyInformation.gpsCoordinates;

        const fresh = getDefaultFormData(keepSurveyor, keepSurveyorId);
        fresh.surveyInformation.societyArea = keepSociety;
        fresh.surveyInformation.gpsCoordinates = keepGps;

        setFormData(fresh);
        setShowSuccess(false);
        setSubmittedData(null);
        setErrors({});
      }, 3000);
    } catch (error) {
      toast.dismiss("upload-toast");
      const raw = error instanceof Error ? error.message : "Submission failed";
      const isAuth =
        raw.toLowerCase().includes("unauthenticated") ||
        raw.toLowerCase().includes("not authenticated") ||
        raw.toLowerCase().includes("sign-in expired");

      if (isAuth) {
        toast.error("❌ Sign-in required", {
          description:
            "Your session expired or the Convex auth pipeline is not configured. " +
            "Please sign out, sign back in, and try again. If the problem persists, " +
            "ask the team to verify the Convex Auth configuration on the Convex deployment.",
        });
      } else {
        toast.error("❌ Submission Failed", { description: raw });
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [isFormValid, isSubmitting, buildPayload, isOnline, submitSurvey, generateUploadUrl, formData]);


  // Start next house handler
  const handleStartNextHouse = useCallback(() => {
    const keepSurveyor = formData.surveyInformation.surveyorName;
    const keepSurveyorId = formData.surveyInformation.surveyorId;
    const keepSociety = formData.surveyInformation.societyArea;
    const keepGps = formData.surveyInformation.gpsCoordinates;

    const fresh = getDefaultFormData(keepSurveyor, keepSurveyorId);
    fresh.surveyInformation.societyArea = keepSociety;
    fresh.surveyInformation.gpsCoordinates = keepGps;

    setFormData(fresh);
    setShowSuccess(false);
    setSubmittedData(null);
    setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [formData]);

  // Loading state
  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#003087] border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading survey...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-950 pb-24">
      {/* ── Convex Deployment Status Banner ── */}
      <ConvexStatusBanner />

      {/* ── Offline Banner ── */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-amber-500 text-white text-center text-sm font-medium py-2 px-4"
          >
            ⚠️ No internet — data will be saved locally
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Sticky Header ── */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#003087] text-white font-bold text-sm">
                FC
              </div>
              <div>
                <h1 className="text-base font-bold text-[#003087] dark:text-[#00AEEF] font-display leading-tight">
                  Falkon Survey
                </h1>
                <p className="text-xs text-muted-foreground">
                  Water Tank Inspection
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#003087] dark:text-[#00AEEF]">
                {completedSections}/9
              </span>
              <div className="hidden sm:block text-xs text-muted-foreground">
                sections
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-2 h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#003087] to-[#00AEEF]"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      {/* ── Success Overlay ── */}
      <AnimatePresence>
        {showSuccess && submittedData && (
          <motion.div
            variants={successVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-[60] flex items-center justify-center bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm px-4"
          >
            <div className="flex flex-col items-center gap-6 text-center max-w-sm">
              {/* Success checkmark animation */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30"
              >
                <svg
                  className="h-10 w-10 text-green-600 dark:text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </motion.div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white font-display">
                  Survey Submitted!
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Data saved successfully
                </p>
              </div>

              {/* Summary card */}
              <div className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 text-left shadow-sm">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Customer</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {submittedData.customerName}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Address</span>
                    <span className="font-medium text-gray-900 dark:text-white text-right max-w-[180px] truncate">
                      {submittedData.address}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Lead Priority</span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        submittedData.leadPriority === "Hot Lead"
                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          : submittedData.leadPriority === "Warm Lead"
                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                            : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      }`}
                    >
                      {submittedData.leadPriority === "Hot Lead"
                        ? "🔴"
                        : submittedData.leadPriority === "Warm Lead"
                          ? "🟡"
                          : "🔵"}{" "}
                      {submittedData.leadPriority}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleStartNextHouse}
                className="w-full rounded-xl bg-[#003087] px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#003087]/90 active:scale-[0.98] min-h-[44px]"
                aria-label="Start next house survey"
              >
                📋 Start Next House
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Form Sections ── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-2xl mx-auto px-4 py-6 space-y-4"
      >
        <motion.div variants={sectionVariants}>
          <SurveyInformationSection
            data={formData.surveyInformation}
            onChange={updateSurveyInformation}
            societies={societies}
          />
        </motion.div>

        <motion.div variants={sectionVariants}>
          <HouseInformationSection
            data={formData.houseInformation}
            onChange={updateHouseInformation}
          />
        </motion.div>

        <motion.div variants={sectionVariants}>
          <CustomerDetailsSection
            data={formData.customerDetails}
            onChange={updateCustomerDetails}
            errors={errors}
          />
        </motion.div>

        <motion.div variants={sectionVariants}>
          <WaterTankDetailsSection
            data={formData.waterTankDetails}
            onChange={updateWaterTankDetails}
          />
        </motion.div>

        <motion.div variants={sectionVariants}>
          <TankHealthCheckSection
            data={formData.tankHealthCheck}
            onChange={updateTankHealthCheck}
          />
        </motion.div>

        <motion.div variants={sectionVariants}>
          <PhotoDocumentationSection
            data={formData.photoDocumentation}
            onChange={updatePhotoDocumentation}
          />
        </motion.div>

        <motion.div variants={sectionVariants}>
          <CustomerResponseSection
            data={formData.customerResponse}
            onChange={updateCustomerResponse}
          />
        </motion.div>

        <motion.div variants={sectionVariants}>
          <SurveyorRemarksSection
            data={formData.surveyorRemarks}
            onChange={updateSurveyorRemarks}
          />
        </motion.div>

        <motion.div variants={sectionVariants}>
          <DeclarationSection
            data={formData.declaration}
            onChange={updateDeclaration}
            surveyorName={surveyorName}
          />
        </motion.div>

        {/* Submit Button */}
        <motion.div variants={sectionVariants} className="pt-2 pb-4">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
            className={`w-full rounded-xl px-6 py-4 text-base font-bold transition-all min-h-[52px] ${
              isFormValid && !isSubmitting
                ? "bg-gradient-to-r from-[#003087] to-[#00AEEF] text-white shadow-lg shadow-[#003087]/25 hover:shadow-xl hover:shadow-[#003087]/30 active:scale-[0.98]"
                : "bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed"
            }`}
            aria-label="Submit survey"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Submitting...
              </span>
            ) : (
              "Submit Survey"
            )}
          </button>
          {!isFormValid && (
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Complete all required fields to enable submission
            </p>
          )}
        </motion.div>
      </motion.div>

      {/* ── Sticky Bottom Progress ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-gray-950/90 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 py-2.5 px-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {sectionStatuses.map((s) => (
                <div
                  key={s.id}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    s.isComplete
                      ? "bg-[#003087] dark:bg-[#00AEEF]"
                      : "bg-gray-300 dark:bg-gray-700"
                  }`}
                  title={`${s.title}: ${s.isComplete ? "Complete" : "Incomplete"}`}
                />
              ))}
            </div>
          </div>
          <p className="text-xs font-medium text-muted-foreground">
            <span className="text-[#003087] dark:text-[#00AEEF] font-bold">
              {completedSections}
            </span>{" "}
            of 9 sections complete
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SurveyPage() {
  return (
    <ErrorBoundary>
      <SurveyPageContent />
    </ErrorBoundary>
  );
}
