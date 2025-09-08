import ReactDOM from 'react-dom/client';
import App from './App.jsx'
import {AuthProvider} from "./context/AuthContext.jsx";
import Modal from 'react-modal';
import './index.css'

Modal.setAppElement("#root");

ReactDOM.createRoot(document.getElementById('root')).render(
    <AuthProvider>
        <App/>
    </AuthProvider>
);
