"use client";
import DiagnosisForm from "@/components/form/diagnosis";
import React, { useEffect, useState } from "react";
import Report from "@/components/report";
import { useSearchParams } from "next/navigation";

export default function Diagnosis() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    disease: searchParams.get("disease") || "",
  });
  const [response, setResponse] = useState("");
  const [analyzed, setAnalyzed] = useState(0);

  useEffect(() => {
    const diagnoses = splitResponse(response);
    setAnalyzed(diagnoses?.length || 0);
  }, [response]);

  useEffect(() => {
    if (searchParams.get("disease")) {
      setFormData({ disease: searchParams.get("disease") });
    }
  }, [searchParams]);

  function splitResponse(response) {
    if (!response) return null;
    // console.log(response);
    return response
      .split("\n")
      .filter((line) => line.trim() !== "")
      .map((line) => JSON.parse(line));
  }

  return (
    <div className="flex">
      <div className="w-1/2">
        <DiagnosisForm
          formData={formData}
          setFormData={setFormData}
          setResponse={setResponse}
          analyzed={analyzed}
        />
      </div>
      {response && (
        <div className="w-1/2">
          <Report input={formData} output={splitResponse(response)} />
        </div>
      )}
    </div>
  );
}
