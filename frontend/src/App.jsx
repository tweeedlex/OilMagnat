import {Routes, Route} from "react-router-dom";
import Main from "./pages/Main/Main";
import routes from "./consts/pageRoutes";
import Footer from "./components/Footer/Footer";
import Leaderboard from "./pages/Leaderboard/Leaderboard";

function App() {
  return (
    <div className="App">
      <main>
        <Routes>
          <Route path={routes.MAIN} element={<Main />} />
          <Route path={routes.LEADERBOARD} element={<Leaderboard />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
