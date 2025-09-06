import App from './App.jsx'
import './index.css'
import ReactDOM from 'react-dom/client';
import Modal from 'react-modal';

Modal.setAppElement("#root");

ReactDOM.createRoot(document.getElementById('root')).render(
    <App />
);
