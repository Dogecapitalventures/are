import Router from "./routes/index";
// import './assets/css/bootstrap.min.css'
import '../node_modules/bootstrap/scss/bootstrap.scss'
import './assets/sass/style.scss'
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <div id="root" style={{minHeight:'100vh', height: '100%'}}>
      <Router />
    </div>
  );
};

export default App;

// "react-app/jest"