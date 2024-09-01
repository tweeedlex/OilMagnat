import { Routes, Route } from "react-router-dom";
import Main from "./pages/Main/Main";
import routes from "./consts/pageRoutes";
import Footer from "./components/Footer/Footer";
import Leaderboard from "./pages/Leaderboard/Leaderboard";
import Profile from "./pages/Profile/Profile";
import Tasks from "./pages/Tasks/Tasks";
import { auth } from "./http/user";
import { useEffect } from "react";
import Upgrades from "./pages/Upgrades/Upgrades";
import { useDispatch } from "react-redux";
import Market from "./pages/Market/Market";
import Workers from "./pages/Workers/Workers";

function App() {
	const dispatch = useDispatch();

	useEffect(() => {
		auth(dispatch);
		setInterval(() => auth(dispatch), 1000 * 60 * 50);
	}, []);

  return (
    <div className="App">
      <main>
        <Routes>
          <Route path={routes.MAIN} element={<Main />} />
          <Route path={routes.LEADERBOARD} element={<Leaderboard />} />
          <Route path={routes.PROFILE} element={<Profile />} />
          <Route path={routes.TASKS} element={<Tasks />} />
          <Route path={routes.UPGRADES} element={<Upgrades />} />
          <Route path={routes.MARKET} element={<Market />} />
          <Route path={routes.WORKERS} element={<Workers />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App;
