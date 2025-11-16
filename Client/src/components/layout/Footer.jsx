export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">AgriSmart Kenya</h3>
            <p className="text-gray-400 text-sm">
              Empowering Kenyan farmers through digital innovation and data-driven agricultural solutions.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/dashboard" className="text-gray-400 hover:text-white">Dashboard</a></li>
              <li><a href="/farms" className="text-gray-400 hover:text-white">My Farms</a></li>
              <li><a href="/marketplace" className="text-gray-400 hover:text-white">Marketplace</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <p className="text-gray-400 text-sm">Nairobi, Kenya</p>
            <p className="text-gray-400 text-sm">Email: info@agrismart.co.ke</p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="text-gray-400 text-sm">
            Copyright {currentYear} AgriSmart Kenya. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}