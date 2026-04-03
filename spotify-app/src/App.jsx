import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Error from './navigation/Error';
import Nav from './navigation/Nav';
import Footer from './navigation/Footer';

import Login from './pages/Login';

export default function App() {
	return (
		<div className="App">
		<Router>
			<Nav />
			<Routes>
				<Route path="/" element={<Login />} />
				<Route path="*" element={<Error code={404} />} />
			</Routes>
			<Footer />
		</Router>
	</div>
	)
}