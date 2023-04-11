import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoginContainer, PostingContainer } from "./containers";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginContainer />} />
        <Route path="/post" element={<PostingContainer />} />
      </Routes>
    </Router>
  );
};

export default App;
