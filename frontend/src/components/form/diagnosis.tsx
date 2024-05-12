"use client";
import React from "react";

import FormBuilder from "@/components/form/form_builder";
import Dropzone from "@/components/form/field/upload";
import { sendFormData, streamingResponse } from "@/utils/backend";

export type formData = {
  disease: string;
  files?: File[];
};

interface DiagnosisFormProps {
  formData: formData;
  setFormData: React.Dispatch<React.SetStateAction<formData>>;
  setResponse: (response: any) => void;
  analyzed: number;
}

const DiagnosisForm: React.FC<DiagnosisFormProps> = ({
  formData,
  setFormData,
  setResponse,
  analyzed,
}) => {
  const onSubmit = async (data: formData) => {
    const form_data = new FormData();
    form_data.append("disease", formData.disease);

    if (data.files) {
      for (const file of data.files) {
        form_data.append("files", file);
      }
    }

    sendFormData("diagnose", form_data)
      .then((response) => streamingResponse(response, setResponse))
      .catch(console.error);
  };

  const setFiles = (files: File[]) => {
    setFormData({ ...formData, files: files });
  };

  return (
    <FormBuilder
      submit_label="Submit"
      onSubmit={onSubmit}
      formData={formData}
      setFormData={setFormData}
    >
      <Dropzone key="dropzone" setFiles={setFiles} analyzed={analyzed} />
    </FormBuilder>
  );
};

export default DiagnosisForm;
