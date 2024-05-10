"use client";
import DiagnosisForm from "@/components/form/diagnosis";
import React, { useState } from "react";

export default function Diagnosis() {
  const [formData, setFormData] = useState({});

  return (
    <div>
      <DiagnosisForm formData={formData} setFormData={setFormData} />
    </div>
  );
}
