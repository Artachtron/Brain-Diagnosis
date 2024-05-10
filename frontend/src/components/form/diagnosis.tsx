import FormBuilder from "@/components/form/form_builder";
import Dropzone from "@/components/form/field/upload";
import { backendRequest } from "@/utils/backend";

const UploadForm = () => {
  const onSubmit = async (data) => {
    const response = await backendRequest("POST", "diagnose", data);
    console.log(response);
  };

  return (
    <FormBuilder
      submit_label="Submit"
      onSubmit={onSubmit}
      formData={{ files: [] }}
      children={[<Dropzone label="Upload a file" />]}
    />
  );
};

export default UploadForm;
