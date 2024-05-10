import { Button } from "@mui/material";

interface FormBuilderProps {
  children: React.ReactNode[];
  submit_label: string;
  onSubmit: (data: Record<string, unknown>) => void;
  formData: Record<string, unknown>;
  setFormData: React.Dispatch<React.SetStateAction<Record<string, unknown>>>;
}

const FormBuilder = (props: FormBuilderProps) => {
  const { children, submit_label, onSubmit, formData, setFormData } = props;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="flex justify-center">
      <form onSubmit={handleSubmit} className="w-1/2 mx-auto">
        {children}
        <div className="flex justify-center">
          <Button variant="contained" type="submit">
            {submit_label}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FormBuilder;
