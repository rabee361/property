import { Navigate, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Index from './pages/index/Index'
import Properties from './pages/Properties'
import PropertyDetails from './pages/PropertyDetails'
import Favorites from './pages/Favorites'
import Signup from './pages/Signup'
import Login from './pages/Login'
import ChangePassword from './pages/ChangePassword'
import RequireAuth from './components/RequireAuth'

import AdminLayout from './pages/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import AdminProfiles from './pages/admin/Users'
import AdminProperties from './pages/admin/Properties'

import ProfileLayout from './pages/owner/ProfileLayout'
import CreateProfile from './pages/owner/CreateProfile'
import MyProperties from './pages/owner/MyProperties'
import ProfileInfo from './pages/owner/ProfileInfo'
import PropertyEdit from './pages/owner/PropertyEdit'
// import BuyerLayout from './pages/buyer/BuyerLayout'
// import BuyerHome from './pages/buyer/BuyerHome'
// import BuyerFavorites from './pages/buyer/BuyerFavorites'
// import BuyerOffers from './pages/buyer/BuyerOffers'
// import BuyerProfile from './pages/buyer/BuyerProfile'

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/properties/:id" element={<PropertyDetails />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<Login mode="admin" />} />

        <Route element={<RequireAuth accountType="admin" />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="users" element={<Navigate to="/admin/profiles" replace />} />
            <Route path="profiles" element={<AdminProfiles />} />
            <Route path="properties" element={<AdminProperties />} />
            <Route path="change-password" element={<ChangePassword />} />
          </Route>
        </Route>

        <Route element={<RequireAuth accountType="user" />}>
          <Route path="/favorites" element={<Favorites />} />

          <Route path="/owner" element={<ProfileLayout />}>
            <Route index element={<MyProperties />} />
            <Route path="profile/create" element={<CreateProfile />} />
            <Route path="info" element={<ProfileInfo />} />
            <Route path="change-password" element={<ChangePassword />} />
            <Route path="properties/new" element={<PropertyEdit />} />
            <Route path="properties/:id/edit" element={<PropertyEdit />} />
          </Route>

          {/* Buyer routes are disabled for now.
          <Route path="/buyer" element={<BuyerLayout />}>
            <Route index element={<BuyerHome />} />
            <Route path="favorites" element={<BuyerFavorites />} />
            <Route path="offers" element={<BuyerOffers />} />
            <Route path="profile" element={<BuyerProfile />} />
          </Route>
          */}
        </Route>
      </Routes>
    </>
  )
}

export default App
