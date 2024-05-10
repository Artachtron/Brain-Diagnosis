"use client";
import DiagnosisForm from "@/components/form/diagnosis";
import React, { useState } from "react";
import Report from "@/components/report";

export default function Diagnosis() {
  const [formData, setFormData] = useState({});
  const [response, setResponse] = useState("");

  function splitResponse(response) {
    if (!response) return null;
    console.log(response);
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
