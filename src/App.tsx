import { AuthProvider } from './contexts/AuthContext';
import { Router, Route } from './components/Router';
import { ProtectedRoute } from './components/ProtectedRoute';

import { Login } from './pages/admin/Login';
import { Dashboard } from './pages/admin/Dashboard';
import { Properties } from './pages/admin/Properties';
import { PropertyForm } from './pages/admin/PropertyForm';
import { Leads } from './pages/admin/Leads';

import { Home } from './pages/public/Home';
import { Search } from './pages/public/Search';
import { PropertyDetail } from './pages/public/PropertyDetail';
import { Contact } from './pages/public/Contact';
import { AboutUs } from './pages/public/AboutUs';
import { ListProperty } from './pages/public/ListProperty';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Route path="/admin/login">
          <Login />
        </Route>

        <Route path="/admin">
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        </Route>

        <Route path="/admin/properties">
          <ProtectedRoute>
            <Properties />
          </ProtectedRoute>
        </Route>

        <Route path="/admin/properties/new">
          <ProtectedRoute>
            <PropertyForm />
          </ProtectedRoute>
        </Route>

        <Route path="/admin/properties/edit/:id">
          <ProtectedRoute>
            <PropertyFormWrapper />
          </ProtectedRoute>
        </Route>

        <Route path="/admin/leads">
          <ProtectedRoute>
            <Leads />
          </ProtectedRoute>
        </Route>

        <Route path="/search">
          <Search />
        </Route>

        <Route path="/property/:slug">
          <PropertyDetailWrapper />
        </Route>

        <Route path="/contact">
          <Contact />
        </Route>

        <Route path="/o-nama">
          <AboutUs />
        </Route>

        <Route path="/ponudite-nekretninu">
          <ListProperty />
        </Route>

        <Route path="/">
          <Home />
        </Route>
      </Router>
    </AuthProvider>
  );
}

function PropertyFormWrapper() {
  const pathParts = window.location.pathname.split('/');
  const propertyId = pathParts[pathParts.length - 1];
  return <PropertyForm isEdit={true} propertyId={propertyId} />;
}

function PropertyDetailWrapper() {
  const pathParts = window.location.pathname.split('/');
  const slug = pathParts[pathParts.length - 1];
  return <PropertyDetail slug={slug} />;
}

export default App;
