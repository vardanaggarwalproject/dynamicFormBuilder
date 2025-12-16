import "./App.css";
import ManualJson from "./common/ManualJson";
import { FormWithZod } from "./FormWithZod";
import {DynamicForm} from "./hooks/customHook"
function App() {

  return (
    <>
      <div className="flex flex-col items-center justify-items-center min-h-screen px-10 gap-6 my-6 py-2">
       <FormWithZod/>
        <DynamicForm />
        <ManualJson/>
      </div>
    </>
  );
}

export default App;
