import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="app">
      <Outlet />
    </div>
  )
};

export default Layout;