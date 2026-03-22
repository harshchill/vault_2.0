"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, FileText, X, CheckCircle2, AlertCircle,
  Building2, BookOpenText, Sparkles, GraduationCap,
  Calendar, Loader2
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { createBrowserClient, validatePdfFile, generateUniqueFileName } from "@/lib/supabase";

const fadeInUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.22, 0.61, 0.36, 1] },
  }),
};

export default function UploadPaperPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const fileInputRef = useRef(null);

  // Form state
  const [formData, setFormData] = useState({
    institute: "",
    subject: "",
    program: "",
    specialization: "",
    semester: "",
    year: new Date().getFullYear(),
  });

  // File state
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  // Upload state
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(null); // 'success' | 'error'
  const [statusMessage, setStatusMessage] = useState("");

  // Validation errors
  const [errors, setErrors] = useState({});

  const semesterOptions = Array.from({ length: 12 }, (_, i) => i + 1);
  const yearOptions = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

  // Redirect if not authenticated
  if (status === "unauthenticated") {
    router.push("/auth/login?callbackUrl=/user/upload");
    return null;
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(160deg, #F7F0F0 0%, #eef5ec 60%, #F7F0F0 100%)" }}>
        <div className="flex items-center gap-2 text-sm" style={{ color: "#25671E" }}>
          <Loader2 size={18} className="animate-spin" />
          Loading...
        </div>
      </div>
    );
  }

  // File selection handlers
  const handleFileSelect = (file) => {
    setFileError("");
    setErrors({});

    const validation = validatePdfFile(file);
    if (!validation.valid) {
      setFileError(validation.error);
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFileError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.institute.trim()) newErrors.institute = "Institute is required";
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.program.trim()) newErrors.program = "Program is required";
    if (!formData.specialization.trim()) newErrors.specialization = "Specialization is required";
    if (!formData.semester) newErrors.semester = "Semester is required";
    if (!formData.year) newErrors.year = "Year is required";
    if (!selectedFile) newErrors.file = "Please select a PDF file";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Upload handler
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setStatusMessage("Please fill all required fields");
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setUploadStatus(null);
    setStatusMessage("");

    try {
      const supabase = createBrowserClient();
      const userId = session.user.id;

      // Generate unique filename
      const uniqueFileName = generateUniqueFileName(userId, selectedFile.name);
      const filePath = `uploads/${uniqueFileName}`;

      // Upload to Supabase Storage (direct browser → Supabase)
      setUploadProgress(30);
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('Vault-2.0')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw new Error(uploadError.message || "Failed to upload file");
      }

      setUploadProgress(60);

      // Get public URL
      const { data: urlData } = supabase
        .storage
        .from('papers')
        .getPublicUrl(filePath);

      const publicURL = urlData.publicUrl;

      setUploadProgress(80);

      // Create Paper record via API route
      const response = await fetch('/api/papers/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uploaderID: userId,
          institute: formData.institute.trim(),
          subject: formData.subject.trim(),
          program: formData.program.trim(),
          specialization: formData.specialization.trim(),
          semester: parseInt(formData.semester),
          year: parseInt(formData.year),
          storageFileName: uniqueFileName,
          storageURL: publicURL,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        // If DB save fails, try to delete the uploaded file
        await supabase.storage.from('papers').remove([filePath]);
        throw new Error(result.error || "Failed to save paper record");
      }

      setUploadProgress(100);
      setUploadStatus("success");
      setStatusMessage("Paper uploaded successfully! Pending admin approval.");

      // Reset form after 2 seconds
      setTimeout(() => {
        setFormData({
          institute: "",
          subject: "",
          program: "",
          specialization: "",
          semester: "",
          year: new Date().getFullYear(),
        });
        setSelectedFile(null);
        setUploadProgress(0);
        setUploadStatus(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }, 2000);

    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus("error");
      setStatusMessage(error.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen px-4 py-12 sm:px-6 lg:px-10"
      style={{ background: "linear-gradient(160deg, #F7F0F0 0%, #eef5ec 60%, #F7F0F0 100%)" }}
    >
      {/* Background texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "radial-gradient(#25671E 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-4xl">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold mb-4"
            style={{
              background: "rgba(72, 161, 17, 0.12)",
              border: "1px solid rgba(72, 161, 17, 0.25)",
              color: "#25671E",
            }}
          >
            <Upload size={14} />
            Share knowledge, earn rewards
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold" style={{ color: "#25671E" }}>
            Upload Question Paper
          </h1>
          <p className="mt-3 text-sm sm:text-base" style={{ color: "#25671E", opacity: 0.65 }}>
            Share your question papers with fellow students. Each approved paper earns you coins!
          </p>
        </motion.div>

        {/* Upload Form Card */}
        <motion.form
          onSubmit={handleUpload}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={0.1}
          className="rounded-2xl border p-6 sm:p-8"
          style={{
            background: "white",
            border: "1px solid rgba(37, 103, 30, 0.15)",
            boxShadow: "0 8px 26px rgba(37, 103, 30, 0.08)",
          }}
        >
          {/* File Upload Area */}
          <div className="mb-6">
            <label className="text-xs font-semibold block mb-2" style={{ color: "#25671E" }}>
              PDF File *
            </label>

            {!selectedFile ? (
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                  isDragging ? "border-[#48A111] bg-[rgba(72,161,17,0.05)]" : ""
                }`}
                style={{
                  borderColor: errors.file ? "#DC2626" : isDragging ? "#48A111" : "rgba(37, 103, 30, 0.25)",
                }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="flex flex-col items-center gap-3">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(72, 161, 17, 0.12)" }}
                  >
                    <Upload size={28} style={{ color: "#48A111" }} />
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: "#25671E" }}>
                      Drop your PDF here or click to browse
                    </p>
                    <p className="text-xs mt-1" style={{ color: "#25671E", opacity: 0.6 }}>
                      Maximum file size: 10MB
                    </p>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileInputChange}
                  className="hidden"
                  disabled={uploading}
                />
              </div>
            ) : (
              <div
                className="border rounded-xl p-4 flex items-center justify-between"
                style={{ border: "1px solid rgba(72, 161, 17, 0.3)", background: "rgba(72, 161, 17, 0.05)" }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: "rgba(72, 161, 17, 0.15)" }}
                  >
                    <FileText size={20} style={{ color: "#48A111" }} />
                  </div>
                  <div>
                    <p className="font-medium text-sm" style={{ color: "#25671E" }}>
                      {selectedFile.name}
                    </p>
                    <p className="text-xs" style={{ color: "#25671E", opacity: 0.6 }}>
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                {!uploading && (
                  <button
                    type="button"
                    onClick={removeFile}
                    className="p-2 hover:bg-red-50 rounded-full transition-colors"
                    style={{ color: "#DC2626" }}
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            )}

            {(fileError || errors.file) && (
              <p className="text-xs mt-2" style={{ color: "#DC2626" }}>
                {fileError || errors.file}
              </p>
            )}
          </div>

          {/* Form Fields Grid */}
          <div className="grid gap-4 sm:grid-cols-2 mb-6">
            <FormField
              label="Institute / University"
              icon={<Building2 size={16} />}
              value={formData.institute}
              onChange={(value) => setFormData(prev => ({ ...prev, institute: value }))}
              placeholder="e.g., RGPV, VTU, Mumbai University"
              error={errors.institute}
              disabled={uploading}
            />

            <FormField
              label="Subject"
              icon={<BookOpenText size={16} />}
              value={formData.subject}
              onChange={(value) => setFormData(prev => ({ ...prev, subject: value }))}
              placeholder="e.g., Data Structures, DBMS"
              error={errors.subject}
              disabled={uploading}
            />

            <FormField
              label="Program / Course"
              icon={<GraduationCap size={16} />}
              value={formData.program}
              onChange={(value) => setFormData(prev => ({ ...prev, program: value }))}
              placeholder="e.g., B.Tech CSE, MCA"
              error={errors.program}
              disabled={uploading}
            />

            <FormField
              label="Specialization"
              icon={<Sparkles size={16} />}
              value={formData.specialization}
              onChange={(value) => setFormData(prev => ({ ...prev, specialization: value }))}
              placeholder="e.g., AI & ML, Cyber Security"
              error={errors.specialization}
              disabled={uploading}
            />

            <FormSelect
              label="Semester"
              value={formData.semester}
              onChange={(value) => setFormData(prev => ({ ...prev, semester: value }))}
              options={semesterOptions.map(s => ({ value: s, label: `Semester ${s}` }))}
              placeholder="Select semester"
              error={errors.semester}
              disabled={uploading}
            />

            <FormSelect
              label="Year"
              icon={<Calendar size={16} />}
              value={formData.year}
              onChange={(value) => setFormData(prev => ({ ...prev, year: value }))}
              options={yearOptions.map(y => ({ value: y, label: y.toString() }))}
              error={errors.year}
              disabled={uploading}
            />
          </div>

          {/* Upload Progress */}
          <AnimatePresence>
            {uploading && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium" style={{ color: "#25671E" }}>
                    Uploading...
                  </span>
                  <span className="text-sm font-medium" style={{ color: "#48A111" }}>
                    {uploadProgress}%
                  </span>
                </div>
                <div
                  className="w-full h-2 rounded-full overflow-hidden"
                  style={{ background: "rgba(37, 103, 30, 0.1)" }}
                >
                  <motion.div
                    className="h-full"
                    style={{ background: "#48A111" }}
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Status Messages */}
          <AnimatePresence>
            {statusMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-6 rounded-lg border px-4 py-3 flex items-center gap-2"
                style={{
                  background: uploadStatus === "success"
                    ? "rgba(72, 161, 17, 0.08)"
                    : "rgba(239, 68, 68, 0.05)",
                  border: uploadStatus === "success"
                    ? "1px solid rgba(72, 161, 17, 0.35)"
                    : "1px solid rgba(239, 68, 68, 0.3)",
                  color: uploadStatus === "success" ? "#25671E" : "#991b1b",
                }}
              >
                {uploadStatus === "success" ? (
                  <CheckCircle2 size={18} style={{ color: "#48A111" }} />
                ) : (
                  <AlertCircle size={18} style={{ color: "#DC2626" }} />
                )}
                <span className="text-sm">{statusMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={uploading || uploadStatus === "success"}
            className="w-full py-3 rounded-full font-semibold text-white transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            style={{ background: uploading ? "#1a4d15" : "#25671E", boxShadow: "0 6px 18px rgba(37, 103, 30, 0.3)" }}
          >
            {uploading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Uploading...
              </>
            ) : uploadStatus === "success" ? (
              <>
                <CheckCircle2 size={18} />
                Uploaded Successfully
              </>
            ) : (
              <>
                <Upload size={18} />
                Upload Paper
              </>
            )}
          </button>

          {/* Info Note */}
          <p className="text-xs text-center mt-4" style={{ color: "#25671E", opacity: 0.6 }}>
            Your paper will be reviewed by our team before being made available to other students.
          </p>
        </motion.form>
      </div>
    </div>
  );
}

// Reusable form field component
function FormField({ label, icon, value, onChange, placeholder, error, disabled }) {
  return (
    <div>
      <label className="text-xs font-semibold block mb-2" style={{ color: "#25671E" }}>
        {label} *
      </label>
      <div className="relative flex items-center">
        {icon && (
          <span className="absolute left-3" style={{ color: "#48A111" }}>
            {icon}
          </span>
        )}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full rounded-lg border py-2.5 pr-3 text-sm"
          style={{
            paddingLeft: icon ? "2.5rem" : "0.75rem",
            border: error ? "1px solid #DC2626" : "1px solid rgba(37, 103, 30, 0.15)",
            color: "#25671E",
            background: "white",
          }}
        />
      </div>
      {error && (
        <p className="text-xs mt-1" style={{ color: "#DC2626" }}>
          {error}
        </p>
      )}
    </div>
  );
}

// Reusable select component
function FormSelect({ label, icon, value, onChange, options, placeholder, error, disabled }) {
  return (
    <div>
      <label className="text-xs font-semibold block mb-2" style={{ color: "#25671E" }}>
        {label} *
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full rounded-lg border px-3 py-2.5 text-sm"
        style={{
          border: error ? "1px solid #DC2626" : "1px solid rgba(37, 103, 30, 0.15)",
          color: "#25671E",
          background: "white",
        }}
      >
        <option value="">{placeholder || "Select..."}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-xs mt-1" style={{ color: "#DC2626" }}>
          {error}
        </p>
      )}
    </div>
  );
}
