import { useNavigate } from "react-router-dom";

function Policy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100">
      {/* Back Button */}
      <div className="pt-6 px-6 max-w-6xl mx-auto w-full">
        <button
          onClick={() => navigate(-1)}
          className="text-orange-600 hover:text-orange-500 underline mb-6"
        >
          ← Back
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Privacy Policy</h1>
          <p className="text-gray-400 text-sm">Last updated: January 26, 2026</p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Introduction */}
          <section className="bg-gray-800 rounded-lg p-6 border border-orange-700/30">
            <h2 className="text-2xl font-bold text-orange-600 mb-4">Introduction</h2>
            <p className="text-gray-300">
              Fabularium ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains
              how we collect, use, disclose, and otherwise process your information in connection with our website,
              applications, and services.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="bg-gray-800 rounded-lg p-6 border border-orange-700/30">
            <h2 className="text-2xl font-bold text-orange-600 mb-4">Information We Collect</h2>
            <div className="space-y-4 text-gray-300">
              <div>
                <h3 className="font-semibold text-white mb-2">Personal Information</h3>
                <p>
                  When you create an account, we collect: email address, username, password, and profile information.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">Campaign Data</h3>
                <p>
                  Information about your campaigns, characters, NPCs, locations, and other content you create within Fabularium.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">Usage Information</h3>
                <p>
                  Data about how you interact with our service, including IP addresses, browser type, pages visited, and timestamps.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">Cookies</h3>
                <p>
                  We use cookies and similar technologies to enhance your experience and remember your preferences.
                </p>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section className="bg-gray-800 rounded-lg p-6 border border-orange-700/30">
            <h2 className="text-2xl font-bold text-orange-600 mb-4">How We Use Your Information</h2>
            <ul className="text-gray-300 space-y-2">
              <li>✓ To provide and maintain our service</li>
              <li>✓ To process your account and enable you to access features</li>
              <li>✓ To communicate with you about updates and changes</li>
              <li>✓ To improve and optimize our service</li>
              <li>✓ To detect and prevent fraudulent or unauthorized activity</li>
              <li>✓ To comply with legal obligations</li>
            </ul>
          </section>

          {/* Data Security */}
          <section className="bg-gray-800 rounded-lg p-6 border border-orange-700/30">
            <h2 className="text-2xl font-bold text-orange-600 mb-4">Data Security</h2>
            <p className="text-gray-300">
              We implement appropriate technical and organizational measures to protect your personal information against
              unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet
              or electronic storage is 100% secure.
            </p>
          </section>

          {/* Data Retention */}
          <section className="bg-gray-800 rounded-lg p-6 border border-orange-700/30">
            <h2 className="text-2xl font-bold text-orange-600 mb-4">Data Retention</h2>
            <p className="text-gray-300">
              We retain your personal information for as long as your account is active or as needed to provide our services.
              You can request deletion of your account and associated data at any time.
            </p>
          </section>

          {/* Sharing Information */}
          <section className="bg-gray-800 rounded-lg p-6 border border-orange-700/30">
            <h2 className="text-2xl font-bold text-orange-600 mb-4">Sharing Your Information</h2>
            <p className="text-gray-300 mb-3">
              We do not sell, trade, or rent your personal information to third parties. We may share information with:
            </p>
            <ul className="text-gray-300 space-y-2">
              <li>• Service providers who assist us in operating our website and conducting our business</li>
              <li>• Law enforcement if required by law</li>
              <li>• Other parties with your consent</li>
            </ul>
          </section>

          {/* Your Rights */}
          <section className="bg-gray-800 rounded-lg p-6 border border-orange-700/30">
            <h2 className="text-2xl font-bold text-orange-600 mb-4">Your Rights</h2>
            <p className="text-gray-300 mb-3">
              Depending on your location, you may have certain rights regarding your personal information:
            </p>
            <ul className="text-gray-300 space-y-2">
              <li>• Right to access your data</li>
              <li>• Right to correct inaccurate data</li>
              <li>• Right to delete your data</li>
              <li>• Right to data portability</li>
              <li>• Right to opt-out of certain processing</li>
            </ul>
          </section>

          {/* Contact Information */}
          <section className="bg-orange-900/20 rounded-lg p-6 border border-orange-700/30">
            <h2 className="text-2xl font-bold text-orange-600 mb-4">Contact Us</h2>
            <p className="text-gray-300">
              If you have questions about this Privacy Policy or our privacy practices, please contact us at:
            </p>
            <p className="text-gray-300 mt-3">
              <a href="mailto:privacy@fabularium.dev" className="text-orange-500 hover:text-orange-400">
                privacy@fabularium.dev
              </a>
            </p>
          </section>

          {/* Changes to Policy */}
          <section className="bg-gray-800 rounded-lg p-6 border border-orange-700/30">
            <h2 className="text-2xl font-bold text-orange-600 mb-4">Changes to This Policy</h2>
            <p className="text-gray-300">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new
              Privacy Policy on this page and updating the "Last updated" date above.
            </p>
          </section>
        </div>
      </div>

      {/* Footer Spacing */}
      <div className="py-8"></div>
    </div>
  );
}

export default Policy;
