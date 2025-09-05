import Home from "./pages/Home";
import { Toaster } from "sonner";

const App = () => {
  return (
    <div className=" bg-white">
      <Toaster position="top-center" richColors />

      <Home />
    </div>
  );
};

export default App;
