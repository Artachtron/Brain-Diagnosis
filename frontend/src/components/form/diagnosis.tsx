"use client";
import React from "react";

import FormBuilder from "@/components/form/form_builder";
import Dropzone from "@/components/form/field/upload";
import {
  backendRequest,
  sendFormData,
  streamingResponse,
} from "@/utils/backend";

const DiagnosisForm = ({ formData, setFormData, setResponse }) => {
  const onSubmit = async (data) => {
    const form_data = new FormData();
    form_data.append("disease", "ALZHEIMER");

    for (const file of data.files) {
      form_data.append("files", file);
    }

    sendFormData("diagnose", form_data)
      .then(streamingResponse)
      .then((data) => {
        setResponse(data);
      })
      .catch(console.error);
  };

  const setFiles = (files) => {
    setFormData({ ...formData, files: files });
  };

  return (
    <FormBuilder
      submit_label="Submit"
      onSubmit={onSubmit}
      formData={formData}
      setFormData={setFormData}
      children={[
        <Dropzone key="dropzone" label="Upload a file" setFiles={setFiles} />,
      ]}
    />
  );
};

export default DiagnosisForm;
