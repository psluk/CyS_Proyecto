import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { defaultError } from "../utils/ErrorSettings";
import { Helmet } from "react-helmet-async";
import { Button, Input } from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faNetworkWired } from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFetchData = async (showError = false) => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Mock a two-second wait
      const response = await axios.get("/api");
      if (showError) {
        throw new Error("Test error.");
      }
      setData(response.data);
      toast.success("Data fetched successfully!");
    } catch (error) {
      setLoading(false);
      toast.error(defaultError);
    }
  };

  useEffect(() => {
    if (data) {
      setLoading(false);
    }
  }, [data]);

  return (
    <>
      <Helmet>
        <title>Prueba | EmprendeTEC</title>
        <link rel="canonical" href="/" />
      </Helmet>
      <main className="w-full max-w-7xl px-10">
        <span className="text-deep-orange-600">
          <FontAwesomeIcon
            icon={faNetworkWired}
            className="inline-block pe-2"
          />
          Example icon
        </span>
        <p className="italic">Example response from server:</p>
        {data ? (
          <pre>{JSON.stringify(data, null, 2)}</pre>
        ) : (
          <Button
            className="mb-2 w-40"
            color="teal"
            onClick={() => handleFetchData(false)}
            loading={loading}
          >
            Fetch Data
          </Button>
        )}
        <Button
          className="mb-2 w-40"
          color="pink"
          onClick={() => handleFetchData(true)}
          loading={loading}
        >
          Show Error
        </Button>
        <Input type="text" label="Test input" color="teal" />
      </main>
    </>
  );
}
