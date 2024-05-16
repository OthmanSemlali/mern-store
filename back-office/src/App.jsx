import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import { Authentication } from "./container";

function App() {
  return (
    <Routes>
      <Route path="/dashboard/*" element={<Authentication><Dashboard /></Authentication>} />
      <Route path="/dash" element={<Authentication>dd</Authentication>} />
      <Route path="/auth/*" element={<Auth />} />
      {/* <Route path='/auth/success' element={<AuthSuccess />} /> */}

      <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
      {/* <Route path="*" element='err' /> */}
    </Routes>
  );
}

export default App;
