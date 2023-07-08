import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import { AppContext } from './context/context';
// ----------------------------------------------------------------------

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ThemeProvider>
          <AppContext>
            <Router />
          </AppContext>
        </ThemeProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}
