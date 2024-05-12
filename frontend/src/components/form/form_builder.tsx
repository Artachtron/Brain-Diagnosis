import { Button } from "@mui/material";
import { formData } from "./diagnosis";

interface FormBuilderProps {
  submit_label: string;
  onSubmit: (data: formData) => void;
  formData: formData;
  setFormData: React.Dispatch<React.SetStateAction<formData>>;
  children: React.ReactNode;
}

const FormBuilder = (props: FormBuilderProps) => {
  const { submit_label, onSubmit, formData, setFormData, children } = props;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="mx-5">
        {children}
        {formData.files && (
          <div className="flex justify-center">
            <Button variant="contained" type="submit">
              {submit_label}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};

export default FormBuilder;
