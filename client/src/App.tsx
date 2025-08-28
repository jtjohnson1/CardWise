import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./components/ui/theme-provider"
import { Toaster } from "./components/ui/toaster"
import { Layout } from "./components/Layout"
import { Dashboard } from "./pages/Dashboard"
import { Collection } from "./pages/Collection"
import { Wishlist } from "./pages/Wishlist"
import { TradeLists } from "./pages/TradeLists"
import { Analytics } from "./pages/Analytics"
import { Settings } from "./pages/Settings"
import { CardDetails } from "./pages/CardDetails"
import { ScanCards } from "./pages/ScanCards"
import { BlankPage } from "./pages/BlankPage"

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="collection" element={<Collection />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="trade-lists" element={<TradeLists />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
            <Route path="card/:id" element={<CardDetails />} />
            <Route path="scan" element={<ScanCards />} />
          </Route>
          <Route path="*" element={<BlankPage />} />
        </Routes>
      </Router>
      <Toaster />
    </ThemeProvider>
  )
}

export default App