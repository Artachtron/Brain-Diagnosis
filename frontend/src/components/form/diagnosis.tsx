"use client";
import React from "react";

import FormBuilder from "@/components/form/form_builder";
import Dropzone from "@/components/form/field/upload";
import { backendRequest, sendFormData } from "@/utils/backend";

const DiagnosisForm = ({ formData, setFormData }) => {
  const onSubmit = async (data) => {
    const form_data = new FormData();
    form_data.append("disease", "ALZHEIMER");

    for (const file of data.files) {
      form_data.append("files", file);
    }

    // data["disease"] = "ALZHEIMER";
    for (var pair of form_data.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }
    const response = await sendFormData("diagnose", form_data);
    console.log(response);
    const result = await response.json();
    console.log(result);
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
