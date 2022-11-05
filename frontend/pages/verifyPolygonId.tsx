import { useState, useEffect } from 'react';
import QRCode from "react-qr-code";

const getVerificationId = (callback: Function) => {
  const url = 'http://localhost:3001/getPolygonIdVerificationParams';
  fetch(url, { method: 'POST' })
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
      callback(data);
    });
}

const usePolygonIdVerificationRequest = () => {
  const [request, setRequest] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    getVerificationId((request: any) => {
      setRequest(request);
      setIsLoading(false);
    });
  }, []);
  return {
    request,
    isLoading,
  }
}

export default function VerifyPolygonId() {
  const { request, isLoading } = usePolygonIdVerificationRequest();
  return (
    <div className="bg-sky p-10">
      <div style={{ height: "auto", margin: "0 auto", maxWidth: 256, width: "100%" }}>
        {isLoading ? <div>Loading...</div> : (
          <QRCode
            size={256}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            value={JSON.stringify(request)}
            viewBox={`0 0 256 256`}
          />
        )}

      </div>
    </div>
  )
}
