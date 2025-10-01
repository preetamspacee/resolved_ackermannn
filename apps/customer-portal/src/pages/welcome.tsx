import Link from 'next/link';

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-8">
      <div className="max-w-3xl w-full bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 p-10 text-center">
        <div className="mx-auto mb-6 w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold">ACK</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to ACKERMANN</h1>
        <p className="text-gray-600 mb-8">Enterprise Workflow Platform</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold">
            Sign In
          </Link>
          <Link href="/tickets" className="border border-gray-300 hover:border-blue-500 hover:text-blue-600 px-6 py-3 rounded-lg font-semibold text-gray-700">
            Continue as Guest
          </Link>
        </div>
      </div>
    </div>
  );
}


