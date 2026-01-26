import { useNavigate } from "react-router-dom";

function Terms() {
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
          <h1 className="text-4xl font-bold text-white mb-2">Terms of Service</h1>
          <p className="text-gray-400 text-sm">Last updated: January 26, 2026</p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Acceptance of Terms */}
          <section className="bg-gray-800 rounded-lg p-6 border border-orange-700/30">
            <h2 className="text-2xl font-bold text-orange-600 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-300">
              By accessing and using Fabularium, you accept and agree to be bound by the terms and provision of this agreement.
              If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          {/* Use License */}
          <section className="bg-gray-800 rounded-lg p-6 border border-orange-700/30">
            <h2 className="text-2xl font-bold text-orange-600 mb-4">2. Use License</h2>
            <p className="text-gray-300 mb-3">
              Permission is granted to temporarily download one copy of the materials (information or software) on Fabularium
              for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title,
              and under this license you may not:
            </p>
            <ul className="text-gray-300 space-y-2">
              <li>• Modifying or copying the materials</li>
              <li>• Using the materials for any commercial purpose or for any public display</li>
              <li>• Attempting to decompile or reverse engineer any software</li>
              <li>• Removing any copyright or other proprietary notations</li>
              <li>• Transferring the materials to another person or "mirroring" the materials</li>
              <li>• Using the materials for any illegal purpose or in violation of any local, state, national, or international law</li>
            </ul>
          </section>

          {/* Account Registration */}
          <section className="bg-gray-800 rounded-lg p-6 border border-orange-700/30">
            <h2 className="text-2xl font-bold text-orange-600 mb-4">3. Account Registration</h2>
            <p className="text-gray-300 mb-3">
              To use certain features of Fabularium, you may be required to register for an account. You agree to:
            </p>
            <ul className="text-gray-300 space-y-2">
              <li>• Provide accurate, complete, and current information</li>
              <li>• Maintain the confidentiality of your password</li>
              <li>• Accept responsibility for all activities under your account</li>
              <li>• Notify us immediately of any unauthorized use of your account</li>
            </ul>
          </section>

          {/* User Content */}
          <section className="bg-gray-800 rounded-lg p-6 border border-orange-700/30">
            <h2 className="text-2xl font-bold text-orange-600 mb-4">4. User Content</h2>
            <p className="text-gray-300 mb-3">
              Fabularium allows you to create and store various types of content (campaigns, characters, notes, etc.).
            </p>
            <p className="text-gray-300">
              You retain all rights to your content. By using Fabularium, you grant us a license to store, process, and
              display your content as necessary to provide our services. You are responsible for ensuring your content does
              not violate any applicable laws or infringe on third-party rights.
            </p>
          </section>

          {/* Intellectual Property */}
          <section className="bg-gray-800 rounded-lg p-6 border border-orange-700/30">
            <h2 className="text-2xl font-bold text-orange-600 mb-4">5. Intellectual Property Rights</h2>
            <p className="text-gray-300">
              The content on Fabularium, including but not limited to text, graphics, logos, images, and software, is the
              property of Fabularium or its content suppliers and is protected by international copyright laws. Unauthorized
              use of any materials may violate copyright, trademark, and other applicable laws.
            </p>
          </section>

          {/* Limitations of Liability */}
          <section className="bg-gray-800 rounded-lg p-6 border border-orange-700/30">
            <h2 className="text-2xl font-bold text-orange-600 mb-4">6. Limitations of Liability</h2>
            <p className="text-gray-300 mb-3">
              Fabularium is provided on an "as is" basis without warranties of any kind. To the fullest extent permitted by law:
            </p>
            <ul className="text-gray-300 space-y-2">
              <li>• We disclaim all implied warranties, including merchantability and fitness for a particular purpose</li>
              <li>• We are not liable for any damages arising from your use of or inability to use Fabularium</li>
              <li>• We are not liable for loss of data, revenue, or profits</li>
            </ul>
          </section>

          {/* Prohibited Conduct */}
          <section className="bg-gray-800 rounded-lg p-6 border border-orange-700/30">
            <h2 className="text-2xl font-bold text-orange-600 mb-4">7. Prohibited Conduct</h2>
            <p className="text-gray-300 mb-3">
              You agree not to:
            </p>
            <ul className="text-gray-300 space-y-2">
              <li>• Violate any applicable laws or regulations</li>
              <li>• Interfere with or disrupt the service or servers</li>
              <li>• Attempt to gain unauthorized access to our systems</li>
              <li>• Harass, threaten, or defame other users</li>
              <li>• Upload viruses or malicious code</li>
              <li>• Spam or engage in phishing activities</li>
            </ul>
          </section>

          {/* Termination */}
          <section className="bg-gray-800 rounded-lg p-6 border border-orange-700/30">
            <h2 className="text-2xl font-bold text-orange-600 mb-4">8. Termination</h2>
            <p className="text-gray-300">
              We reserve the right to terminate or suspend your account and access to Fabularium at any time, in our sole
              discretion, for any reason, including if we believe you have violated these Terms of Service.
            </p>
          </section>

          {/* Modifications to Service */}
          <section className="bg-gray-800 rounded-lg p-6 border border-orange-700/30">
            <h2 className="text-2xl font-bold text-orange-600 mb-4">9. Modifications to Service</h2>
            <p className="text-gray-300">
              Fabularium reserves the right to modify, suspend, or discontinue the service at any time, with or without notice.
              We shall not be liable to you or any third party for any modification, suspension, or discontinuance of the service.
            </p>
          </section>

          {/* Governing Law */}
          <section className="bg-gray-800 rounded-lg p-6 border border-orange-700/30">
            <h2 className="text-2xl font-bold text-orange-600 mb-4">10. Governing Law</h2>
            <p className="text-gray-300">
              These Terms of Service are governed by and construed in accordance with the laws of Poland, and you irrevocably
              submit to the exclusive jurisdiction of the courts in that location.
            </p>
          </section>

          {/* Contact Information */}
          <section className="bg-orange-900/20 rounded-lg p-6 border border-orange-700/30">
            <h2 className="text-2xl font-bold text-orange-600 mb-4">Contact Us</h2>
            <p className="text-gray-300">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <p className="text-gray-300 mt-3">
              <a href="mailto:legal@fabularium.dev" className="text-orange-500 hover:text-orange-400">
                legal@fabularium.dev
              </a>
            </p>
          </section>
        </div>
      </div>

      {/* Footer Spacing */}
      <div className="py-8"></div>
    </div>
  );
}

export default Terms;
