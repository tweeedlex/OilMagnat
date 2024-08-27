import {Routes, Route} from "react-router-dom";
import Main from "./pages/Main/Main";
import routes from "./consts/pageRoutes";
import Footer from "./components/Footer/Footer";
import Leaderboard from "./pages/Leaderboard/Leaderboard";
import Profile from "./pages/Profile/Profile";
import Tasks from "./pages/Tasks/Tasks";

function App() {
  console.log(window.Telegram.WebApp.initData);

  return (
    <div className="App">
      <main>
        <Routes>
          <Route path={routes.MAIN} element={<Main />} />
          <Route path={routes.LEADERBOARD} element={<Leaderboard />} />
          <Route path={routes.PROFILE} element={<Profile />} />
          <Route path={routes.TASKS} element={<Tasks />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
