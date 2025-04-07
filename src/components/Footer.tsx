
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white shadow-inner py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-business-primary font-bold text-xl mb-4">BizInsight</h3>
            <p className="text-gray-600 mb-4">
              The premier platform connecting businesses and professionals. Discover, connect, and grow with our network of verified businesses.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-600">
              <li>
                <Link to="/" className="hover:text-business-primary">Home</Link>
              </li>
              <li>
                <Link to="/businesses" className="hover:text-business-primary">Businesses</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-business-primary">Sign Up</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-business-primary">Login</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Resources</h4>
            <ul className="space-y-2 text-gray-600">
              <li>
                <a href="#" className="hover:text-business-primary">Business Guide</a>
              </li>
              <li>
                <a href="#" className="hover:text-business-primary">Financial Metrics</a>
              </li>
              <li>
                <a href="#" className="hover:text-business-primary">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="hover:text-business-primary">Terms of Service</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} BizInsight. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
