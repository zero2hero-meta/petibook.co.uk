export const metadata = {
  title: 'Privacy Policy | PetiBoo',
  description:
    'Privacy Policy for PetiBoo (Oasis Software Technology Limited) describing how we collect, use, and protect personal data.',
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-12">
      <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          PetiBoo – Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-slate-600">
          <strong>Last updated:</strong> 25 December 2025
        </p>
      </header>

      <section className="prose prose-slate max-w-none">
        <p>
          This Privacy Policy describes Our policies and procedures on the
          collection, use, and disclosure of Your information when You use the
          Service and informs You about Your privacy rights and how the law
          protects You.
        </p>
        <p>
          We use Your Personal Data to provide and improve the Service. By using
          the Service, You agree to the collection and use of information in
          accordance with this Privacy Policy.
        </p>

        <h2>1. Interpretation and Definitions</h2>

        <h3>Interpretation</h3>
        <p>
          Words with capitalized initials have meanings defined below. These
          definitions apply whether the terms appear in singular or plural.
        </p>

        <h3>Definitions</h3>
        <p>For the purposes of this Privacy Policy:</p>
        <ul>
          <li>
            <strong>Account</strong> means a unique account created for You to
            access the Service.
          </li>
          <li>
            <strong>Company</strong> (referred to as “We”, “Us” or “Our”) refers
            to <strong>Oasis Software Technology Limited</strong>.
          </li>
          <li>
            <strong>Country</strong> refers to the <strong>United Kingdom</strong>.
          </li>
          <li>
            <strong>Cookies</strong> are small files stored on Your device used
            to enhance website functionality.
          </li>
          <li>
            <strong>Data Controller</strong> means the Company, which determines
            how and why Personal Data is processed.
          </li>
          <li>
            <strong>Device</strong> means any device that can access the Service.
          </li>
          <li>
            <strong>Personal Data</strong> means any information relating to an
            identifiable individual.
          </li>
          <li>
            <strong>Service</strong> refers to the PetiBoo website.
          </li>
          <li>
            <strong>Service Provider</strong> means any third party processing
            data on behalf of the Company.
          </li>
          <li>
            <strong>Usage Data</strong> refers to automatically collected data
            related to Service usage.
          </li>
          <li>
            <strong>Website</strong> refers to{' '}
            <a href="https://petiboo.co.uk">https://petiboo.co.uk</a>.
          </li>
          <li>
            <strong>You</strong> means the individual using the Service.
          </li>
        </ul>

        <h2>2. Collecting and Using Your Personal Data</h2>

        <h3>Types of Data Collected</h3>

        <h4>Personal Data</h4>
        <p>We may collect the following Personal Data:</p>
        <ul>
          <li>Email address</li>
          <li>First and last name</li>
          <li>Uploaded photos (user and pet images)</li>
          <li>Payment reference IDs (not card details)</li>
        </ul>

        <h4>Usage Data</h4>
        <p>Usage Data may include:</p>
        <ul>
          <li>IP address</li>
          <li>Browser type and version</li>
          <li>Pages visited</li>
          <li>Time spent on pages</li>
          <li>Device identifiers</li>
        </ul>

        <h2>3. AI-Generated Content &amp; Image Processing</h2>
        <p>
          PetiBoo allows users to upload images of themselves and their pets to
          generate AI-powered caricatures.
        </p>
        <ul>
          <li>
            Uploaded images are processed solely to provide the requested
            Service.
          </li>
          <li>
            Images are not sold or shared with third parties for marketing or
            training unrelated AI models.
          </li>
          <li>
            AI outputs are original creations and do not replicate copyrighted
            characters.
          </li>
          <li>
            Generated images may be stored temporarily to allow downloads and
            re-access.
          </li>
          <li>
            Users retain rights to their generated images, subject to our Terms
            of Service.
          </li>
        </ul>
        <p>
          We may use anonymized and aggregated data to improve AI performance.
        </p>

        <h2>4. Tracking Technologies and Cookies</h2>
        <p>
          We use Cookies and similar technologies for functionality and
          analytics.
        </p>
        <h3>Types of Cookies</h3>
        <ul>
          <li>
            <strong>Essential Cookies</strong> – required for basic functionality
          </li>
          <li>
            <strong>Functionality Cookies</strong> – remember preferences
          </li>
          <li>
            <strong>Analytics Cookies</strong> – understand usage trends
          </li>
        </ul>
        <p>
          You can manage Cookies via your browser settings.
        </p>

        <h2>5. Use of Your Personal Data</h2>
        <p>We use Personal Data to:</p>
        <ul>
          <li>Provide and maintain the Service</li>
          <li>Process payments and fulfill purchases</li>
          <li>Manage user accounts</li>
          <li>Communicate service updates</li>
          <li>Improve AI performance and platform stability</li>
          <li>Comply with legal obligations</li>
        </ul>

        <h2>6. Payments</h2>
        <p>
          We use <strong>Stripe</strong> as our third-party payment processor.
        </p>
        <ul>
          <li>We do not store or process payment card details.</li>
          <li>Payment information is handled securely by Stripe.</li>
          <li>Stripe complies with PCI-DSS standards.</li>
        </ul>
        <p>
          Stripe’s Privacy Policy:{' '}
          <a href="https://stripe.com/privacy">https://stripe.com/privacy</a>
        </p>

        <h2>7. Data Hosting &amp; Authentication</h2>
        <p>
          We use <strong>Supabase</strong> for secure authentication, database
          storage, and server-side processing.
        </p>
        <p>
          Supabase acts as a Data Processor under GDPR and complies with
          applicable data protection laws.
        </p>
        <p>
          Supabase Privacy Policy:{' '}
          <a href="https://supabase.com/privacy">https://supabase.com/privacy</a>
        </p>

        <h2>8. Sharing of Personal Data</h2>
        <p>We may share Personal Data:</p>
        <ul>
          <li>With Service Providers (Stripe, Supabase, infrastructure providers)</li>
          <li>To comply with legal obligations</li>
          <li>During business transfers (merger, acquisition)</li>
          <li>With Your explicit consent</li>
        </ul>
        <p>We never sell Personal Data.</p>

        <h2>9. Data Retention</h2>
        <p>We retain Personal Data only as long as necessary:</p>
        <ul>
          <li>Account data: while the account is active</li>
          <li>Uploaded images: limited retention for service delivery</li>
          <li>Payment records: as required by law</li>
        </ul>

        <h2>10. Transfer of Your Personal Data</h2>
        <p>
          Your data may be processed outside the UK or EEA. We ensure appropriate
          safeguards are in place, including contractual protections.
        </p>

        <h2>11. Security of Your Personal Data</h2>
        <p>
          We use industry-standard security measures. However, no method of
          online transmission is 100% secure.
        </p>

        <h2>12. GDPR &amp; UK GDPR Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access Your Personal Data</li>
          <li>Rectify inaccurate data</li>
          <li>Request deletion</li>
          <li>Object to processing</li>
          <li>Request data portability</li>
          <li>Withdraw consent</li>
        </ul>
        <p>
          To exercise these rights, contact us using the details below.
        </p>

        <h2>13. Children’s Privacy</h2>
        <p>
          PetiBoo does not knowingly collect Personal Data from children under
          13. If such data is identified, it will be removed promptly.
        </p>

        <h2>14. Links to Other Websites</h2>
        <p>
          We are not responsible for third-party websites linked from our
          Service.
        </p>

        <h2>15. Changes to This Privacy Policy</h2>
        <p>
          We may update this Privacy Policy periodically. Updates will be posted
          on this page with a revised “Last updated” date.
        </p>

        <h2>16. Contact Us</h2>
        <p>If you have questions about this Privacy Policy, contact us:</p>
        <ul>
          <li>
            Website:{' '}
            <a href="https://petiboo.co.uk/contact">https://petiboo.co.uk/contact</a>
          </li>
          <li>Email: <a href="mailto:contact@petiboo.co.uk">contact@petiboo.co.uk</a></li>
        </ul>
      </section>
    </main>
  );
}
