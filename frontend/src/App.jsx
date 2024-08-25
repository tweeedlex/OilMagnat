import {Routes, Route} from "react-router-dom";
import Main from "./pages/Main/Main";
import routes from "./consts/pageRoutes";
import Footer from "./components/Footer/Footer";

function App() {
  return (
    <div className="App">
      <main>
        <Routes>
          <Route path={routes.MAIN} element={<Main />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
