import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { IndexContainer, MainContainer } from "./containers";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<IndexContainer />} />
        <Route path="/home" element={<MainContainer />} />
      </Routes>
    </Router>
  );
}

export default App;
