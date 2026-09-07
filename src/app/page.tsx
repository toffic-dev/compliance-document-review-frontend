import Link from "next/link";
import {
  Shield,
  ArrowRight,
  Upload,
  Search,
  CheckCircle,
  FileText,
  AlertTriangle,
  Users,
  Clock,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-slate-900" />
              <span className="font-semibold text-slate-900">Compliance Review</span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#how-it-works" className="text-sm text-slate-600 hover:text-slate-900">How it works</a>
              <a href="#features" className="text-sm text-slate-600 hover:text-slate-900">Features</a>
              <Link href="/login" className="text-sm text-slate-600 hover:text-slate-900">Sign in</Link>
            </nav>
            <Link href="/signup" className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800">
              Get started
            </Link>
          </div>
        </div>
      </header>

      <section className="py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight">
            Smarter Compliance<br />Document Review
          </h1>
          <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
            Streamline your compliance workflow with AI-assisted document analysis. Submit, review, and approve documents faster.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link href="/login" className="inline-flex items-center px-6 py-3 text-base font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">How it works</h2>
            <p className="mt-4 text-lg text-slate-600">Three simple steps to compliance confidence</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
              <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
                <Upload className="h-7 w-7 text-slate-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Upload</h3>
              <p className="text-sm text-slate-600">Submit your compliance documents securely. Support for PDF, DOCX, and XLSX formats.</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
              <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
                <Search className="h-7 w-7 text-slate-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Analyze</h3>
              <p className="text-sm text-slate-600">AI-powered analysis identifies potential compliance issues and flags problematic passages.</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
              <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-7 w-7 text-slate-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Review & Decide</h3>
              <p className="text-sm text-slate-600">Compliance officers review AI findings and make informed approval decisions.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Everything you need</h2>
            <p className="mt-4 text-lg text-slate-600">A complete platform for compliance document management</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <FileText className="h-10 w-10 text-slate-400 mb-4" />
              <h3 className="text-base font-semibold text-slate-900 mb-2">Document Submission</h3>
              <p className="text-sm text-slate-600">Easy drag-and-drop upload with automatic file validation.</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <Search className="h-10 w-10 text-slate-400 mb-4" />
              <h3 className="text-base font-semibold text-slate-900 mb-2">AI-Assisted Review</h3>
              <p className="text-sm text-slate-600">Intelligent analysis highlights potential issues.</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <AlertTriangle className="h-10 w-10 text-slate-400 mb-4" />
              <h3 className="text-base font-semibold text-slate-900 mb-2">Issue Detection</h3>
              <p className="text-sm text-slate-600">Automatic flagging with severity levels and rule references.</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <Users className="h-10 w-10 text-slate-400 mb-4" />
              <h3 className="text-base font-semibold text-slate-900 mb-2">Human Review</h3>
              <p className="text-sm text-slate-600">Expert compliance officers provide final judgment.</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <Clock className="h-10 w-10 text-slate-400 mb-4" />
              <h3 className="text-base font-semibold text-slate-900 mb-2">Revision Tracking</h3>
              <p className="text-sm text-slate-600">Complete version history with status timeline.</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <CheckCircle className="h-10 w-10 text-slate-400 mb-4" />
              <h3 className="text-base font-semibold text-slate-900 mb-2">Transparent Decisions</h3>
              <p className="text-sm text-slate-600">Clear audit trail with officer comments.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-slate-400" />
              <span className="text-sm text-slate-500">Compliance Review</span>
            </div>
            <p className="text-sm text-slate-500">&copy; 2026 Compliance Review. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
