function Navbar() {

  const handleLogout = () => {

    localStorage.removeItem("token");

    window.location.href = "/login";
  };

  return (

    <div className="h-16 bg-slate-900 border-b border-slate-700 flex items-center justify-between px-6">

      <h1 className="text-white text-xl font-semibold">
        Dashboard
      </h1>

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded-lg"
      >
        Logout
      </button>

    </div>
  );
}

export default Navbar;