// app/page.js
export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Deftar Backend API
        </h1>
        <p className="text-gray-600 mb-6">
          Welcome to the Deftar Backend API running on Next.js
        </p>
        <div className="space-y-2 text-sm text-gray-500">
          <p>
            ✅ Health Check:{" "}
            <a href="/api/health" className="text-blue-500 hover:underline">
              /api/health
            </a>
          </p>
          <p>
            🔐 Login:{" "}
            <a href="/api/login" className="text-blue-500 hover:underline">
              /api/login
            </a>
          </p>
          <p>
            📞 Contact:{" "}
            <a href="/api/contact" className="text-blue-500 hover:underline">
              /api/contact
            </a>
          </p>
          <p>
            📦 Orders:{" "}
            <a href="/api/orders" className="text-blue-500 hover:underline">
              /api/orders
            </a>
          </p>
          <p>
            📧 Email:{" "}
            <a href="/api/send-mail" className="text-blue-500 hover:underline">
              /api/send-mail
            </a>
          </p>
          <p>
            📊 Dashboard:{" "}
            <a
              href="/api/dash/status"
              className="text-blue-500 hover:underline"
            >
              /api/dash/status
            </a>
          </p>
          <p>
            🏦 Banks:{" "}
            <a href="/api/banks" className="text-blue-500 hover:underline">
              /api/banks
            </a>
          </p>
          <p>
            🖼️ Models:{" "}
            <a href="/api/models" className="text-blue-500 hover:underline">
              /api/models
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
