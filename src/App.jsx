// import { useState } from "react";
import "./App.css";
// import { Form } from "./Form";
import { FormWithZod } from "./FormWithZod";
// import {DynamicForm} from "./hooks/customHook"
function App() {

  return (
    <>
      <div className="flex flex-col items-center justify-items-center min-h-screen px-10 gap-6 my-6 py-2">
       {/* <Form/> */}
       <FormWithZod/>
        {/* <DynamicForm /> */}
      </div>
    </>
  );
}

export default App;
