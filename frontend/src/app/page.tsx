import { Button, Link } from "@mui/material";

export default function Home() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Link href="/diagnosis?disease=alzheimer">
        <Button variant="contained" color="primary" className="mx-2 p-10">
          Alzheimer
        </Button>
      </Link>
      <Link href="/diagnosis?disease=stroke">
        <Button variant="contained" color="primary" className="mx-2 p-10">
          Brain Stroke
        </Button>
      </Link>
      <Link href="/diagnosis?disease=tumor">
        <Button variant="contained" color="primary" className="mx-2 p-10">
          Brain Tumor
        </Button>
      </Link>
    </div>
  );
}
