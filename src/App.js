// 73
import React from 'react'
import Top from './components/Top'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import Gallery from './components/Gallery'
import Contact from './components/Contact'
import Shop from './components/Shop'
import Footer from './components/Footer'
import AdminHome from './components/AdminHome'
import Signup from './components/Signup'
import Login from './components/login'
import Addproduct from './components/Addproduct'
import Allproducts from './components/Allproducts'
import ProductState from './context/products/ProductState'
import UpdateProduct from './components/UpdateProduct'
import Product_info from './components/Product_info'
import { CurrencyProvider } from './context/CurrencyContext'
import ShoppingCart from './components/ShoppingCart'
import AddCategory from './components/AddCategory'
import Banner from './components/Banner'
import OrderList from './components/OrderList'
import OrderDetails from './components/OrderDetails'
import ConfirmOrders from './components/ConfirmOrders'
import ConfirmOrderDetails from './components/ConfirmOrderDetails'
import Wishlist from './components/Wishlist'
import ProtectedAdminRoute from './components/ProtectedAdminRoute'
import CategoryDisplay from './components/CategoryDisplay'
import Prefooter from './components/Prefooter'
import ScrollToTop from './components/ScrollToTop'
import AdminLayout from './components/AdminLayout'  // ✅ NEW
import SplashScreen from './components/SplashScreen';
import { useState } from 'react';

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  return (
    <>
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      <CurrencyProvider>
        <ProductState>
          <BrowserRouter>
            <Top />
            <ScrollToTop />
            <Routes>
              {/* ===== PUBLIC ROUTES ===== */}
              <Route exact path="/" element={<Home />} />
              <Route exact path="/gallery" element={<Gallery />} />
              <Route exact path="/contact" element={<Contact />} />
              <Route exact path="/shop" element={<Shop />} />
              <Route exact path="/signup" element={<Signup />} />
              <Route exact path="/login" element={<Login />} />
              <Route exact path="/productinfo" element={<Product_info />} />
              <Route exact path="/shoppingcart" element={<ShoppingCart />} />
              <Route exact path="/wishlist" element={<Wishlist />} />
              <Route exact path="/categorydisplay" element={<CategoryDisplay />} />

              {/* ===== ADMIN ROUTES (with AdminNavbar via AdminLayout) ===== */}
              <Route exact path="/adminhome" element={
                <ProtectedAdminRoute>
                  <AdminLayout><AdminHome /></AdminLayout>
                </ProtectedAdminRoute>
              } />
              <Route exact path="/addproduct" element={
                <ProtectedAdminRoute>
                  <AdminLayout><Addproduct /></AdminLayout>
                </ProtectedAdminRoute>
              } />
              <Route exact path="/allproducts" element={
                <ProtectedAdminRoute>
                  <AdminLayout><Allproducts /></AdminLayout>
                </ProtectedAdminRoute>
              } />
              <Route exact path="/updateproduct" element={
                <ProtectedAdminRoute>
                  <AdminLayout><UpdateProduct /></AdminLayout>
                </ProtectedAdminRoute>
              } />
              <Route exact path="/addcategory" element={
                <ProtectedAdminRoute>
                  <AdminLayout><AddCategory /></AdminLayout>
                </ProtectedAdminRoute>
              } />
              <Route exact path="/banner" element={
                <ProtectedAdminRoute>
                  <AdminLayout><Banner /></AdminLayout>
                </ProtectedAdminRoute>
              } />
              <Route exact path="/orders" element={
                <ProtectedAdminRoute>
                  <AdminLayout><OrderList /></AdminLayout>
                </ProtectedAdminRoute>
              } />
              <Route exact path="/orderdetail" element={
                <ProtectedAdminRoute>
                  <AdminLayout><OrderDetails /></AdminLayout>
                </ProtectedAdminRoute>
              } />
              <Route exact path="/confirmorders" element={
                <ProtectedAdminRoute>
                  <AdminLayout><ConfirmOrders /></AdminLayout>
                </ProtectedAdminRoute>
              } />
              <Route exact path="/confirmorderdetails" element={
                <ProtectedAdminRoute>
                  <AdminLayout><ConfirmOrderDetails /></AdminLayout>
                </ProtectedAdminRoute>
              } />
            </Routes>

            <Prefooter />
            <Footer />
          </BrowserRouter>
        </ProductState>
      </CurrencyProvider>
    </>
  )
}

export default App