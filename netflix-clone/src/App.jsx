import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <AppRoutes />
      <ToastContainer position="top-right" theme="dark" />
    </>
  );
}

export default App;