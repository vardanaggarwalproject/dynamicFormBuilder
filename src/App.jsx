import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ManualJson from "./common/ManualJson";
import { FormWithZod } from "./FormWithZod";
import { DynamicForm } from "./hooks/customHook";

// Home component with navigation
function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-10 gap-6">
      <h1 className="text-4xl font-bold mb-8">Dynamic Form Builder</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        <Link
          to="/manual-entry"
          className="p-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-center"
        >
          <h2 className="text-2xl font-semibold mb-2">Manual Entry Form</h2>
          <p className="text-sm">Manually enter form data</p>
        </Link>
        
        <Link
          to="/file-upload"
          className="p-6 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-center"
        >
          <h2 className="text-2xl font-semibold mb-2">File Upload Form</h2>
          <p className="text-sm">Generate form from file</p>
        </Link>
        
        <Link
          to="/json-config"
          className="p-6 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-center"
        >
          <h2 className="text-2xl font-semibold mb-2">JSON Configuration</h2>
          <p className="text-sm">Paste JSON configuration</p>
        </Link>
      </div>
    </div>
  );
}

// Layout component with navigation bar
function Layout({ children }) {
  return (
    <div className="min-h-screen">
      <nav className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="text-xl font-bold">
            Form Builder
          </Link>
          <div className="flex gap-4">
            <Link
              to="/manual-entry"
              className="hover:text-gray-300 transition-colors"
            >
              Manual Entry
            </Link>
            <Link
              to="/file-upload"
              className="hover:text-gray-300 transition-colors"
            >
              File Upload
            </Link>
            <Link
              to="/json-config"
              className="hover:text-gray-300 transition-colors"
            >
              JSON Config
            </Link>
          </div>
        </div>
      </nav>
      <div className="flex flex-col items-center justify-items-center min-h-screen px-10 gap-6 my-6 py-2">
        {children}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Home route */}
        <Route path="/" element={<Home />} />
        
        {/* Manual Entry Form route */}
        <Route
          path="/manual-entry"
          element={
            <Layout>
              <FormWithZod />
            </Layout>
          }
        />
        
        {/* File Upload Form route */}
        <Route
          path="/file-upload"
          element={
            <Layout>
              <DynamicForm />
            </Layout>
          }
        />
        
        {/* JSON Configuration Form route */}
        <Route
          path="/json-config"
          element={
            <Layout>
              <ManualJson />
            </Layout>
          }
        />
        
        {/* 404 Not Found route */}
        <Route
          path="*"
          element={
            <div className="flex flex-col items-center justify-center min-h-screen">
              <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
              <Link to="/" className="text-blue-500 hover:underline">
                Go back to Home
              </Link>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;