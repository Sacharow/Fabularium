function Policy() {
  return (
    <div className="min-h-screen ml-64 bg-dark text-neutral-text">
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-8 py-10 lg:px-12">
        <section className="border-2 border-gold-neutral bg-neutral px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gold-neutral">
                Privacy Policy
              </h1>
              <p className="mt-1 text-sm text-text-neutral">
                Last updated: January 26, 2026
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-4">
          <div className="border-2 border-gold-neutral bg-neutral p-6">
            <h2 className="mb-2 text-lg font-semibold text-gold-neutral">
              Introduction
            </h2>
            <p className="text-sm text-text-neutral">
              Fabularium ("we", "our", or "us") is committed to protecting your
              privacy. This Privacy Policy explains how we collect, use,
              disclose, and otherwise process your information in connection
              with our website, applications, and services.
            </p>
          </div>

          <div className="border-2 border-gold-neutral bg-neutral p-6">
            <h2 className="mb-3 text-lg font-semibold text-gold-neutral">
              Information We Collect
            </h2>
            <div className="space-y-3 text-sm text-text-neutral">
              <div>
                <h3 className="font-semibold text-gold-neutral">
                  Personal Information
                </h3>
                <p>
                  When you create an account, we collect: email address,
                  username, password, and profile information.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gold-neutral">
                  Campaign Data
                </h3>
                <p>
                  Information about your campaigns, characters, NPCs, locations,
                  and other content you create within Fabularium.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gold-neutral">
                  Usage Information
                </h3>
                <p>
                  Data about how you interact with our service, including IP
                  addresses, browser type, pages visited, and timestamps.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gold-neutral">Cookies</h3>
                <p>
                  We use cookies and similar technologies to enhance your
                  experience and remember your preferences.
                </p>
              </div>
            </div>
          </div>

          <div className="border-2 border-gold-neutral bg-neutral p-6">
            <h2 className="mb-3 text-lg font-semibold text-gold-neutral">
              How We Use Your Information
            </h2>
            <ul className="list-disc space-y-1 pl-5 text-sm text-text-neutral">
              <li>To provide and maintain our service</li>
              <li>To process your account and enable access to features</li>
              <li>To communicate with you about updates and changes</li>
              <li>To improve and optimize our service</li>
              <li>To detect and prevent fraudulent or unauthorized activity</li>
              <li>To comply with legal obligations</li>
            </ul>
          </div>

          <div className="border-2 border-gold-neutral bg-neutral p-6">
            <h2 className="mb-2 text-lg font-semibold text-gold-neutral">
              Data Security
            </h2>
            <p className="text-sm text-text-neutral">
              We implement appropriate technical and organizational measures to
              protect your personal information against unauthorized access,
              alteration, disclosure, or destruction. However, no method of
              transmission over the internet or electronic storage is 100%
              secure.
            </p>
          </div>

          <div className="border-2 border-gold-neutral bg-neutral p-6">
            <h2 className="mb-2 text-lg font-semibold text-gold-neutral">
              Data Retention
            </h2>
            <p className="text-sm text-text-neutral">
              We retain your personal information for as long as your account is
              active or as needed to provide our services. You can request
              deletion of your account and associated data at any time.
            </p>
          </div>

          <div className="border-2 border-gold-neutral bg-neutral p-6">
            <h2 className="mb-3 text-lg font-semibold text-gold-neutral">
              Sharing Your Information
            </h2>
            <p className="mb-2 text-sm text-text-neutral">
              We do not sell, trade, or rent your personal information to third
              parties. We may share information with:
            </p>
            <ul className="list-disc space-y-1 pl-5 text-sm text-text-neutral">
              <li>
                Service providers who assist us in operating our website and
                conducting our business
              </li>
              <li>Law enforcement if required by law</li>
              <li>Other parties with your consent</li>
            </ul>
          </div>

          <div className="border-2 border-gold-neutral bg-neutral p-6">
            <h2 className="mb-3 text-lg font-semibold text-gold-neutral">
              Your Rights
            </h2>
            <p className="mb-2 text-sm text-text-neutral">
              Depending on your location, you may have certain rights regarding
              your personal information:
            </p>
            <ul className="list-disc space-y-1 pl-5 text-sm text-text-neutral">
              <li>Right to access your data</li>
              <li>Right to correct inaccurate data</li>
              <li>Right to delete your data</li>
              <li>Right to data portability</li>
              <li>Right to opt-out of certain processing</li>
            </ul>
          </div>

          <div className="border-2 border-gold-neutral bg-neutral p-6">
            <h2 className="mb-2 text-lg font-semibold text-gold-neutral">
              Contact Us
            </h2>
            <p className="text-sm text-text-neutral">
              If you have questions about this Privacy Policy or our privacy
              practices, contact us at{" "}
              <a
                href="mailto:privacy@fabularium.dev"
                className="text-gold-neutral hover:text-gold-light"
              >
                privacy@fabularium.dev
              </a>
              .
            </p>
          </div>

          <div className="border-2 border-gold-neutral bg-neutral p-6">
            <h2 className="mb-2 text-lg font-semibold text-gold-neutral">
              Changes to This Policy
            </h2>
            <p className="text-sm text-text-neutral">
              We may update this Privacy Policy from time to time. We will
              notify you of any changes by posting the new Privacy Policy on
              this page and updating the "Last updated" date above.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Policy;
