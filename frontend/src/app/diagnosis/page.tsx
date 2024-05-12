"use client";
import DiagnosisForm from "@/components/form/diagnosis";
import React, { Suspense, useEffect, useState } from "react";
import Report from "@/components/report";
import { useSearchParams } from "next/navigation";
import { formData } from "@/components/form/diagnosis";

function DiagnosisComponent() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState<formData>({
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
      setFormData({ disease: searchParams.get("disease") || "alzheimer" });
    }
  }, [searchParams]);

  function splitResponse(response: string) {
    if (!response) return [];
    // console.log(response);
    return response
      .split("\n")
      .filter((line) => line.trim() !== "")
      .map((line) => JSON.parse(line));
  }

  return (
    <div className="flex pt-5">
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
          <Report
            input={formData}
            output={splitResponse(response)}
            progress={analyzed}
          />
        </div>
      )}
    </div>
  );
}

export default function Diagnosis() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DiagnosisComponent />
    </Suspense>
  );
}
