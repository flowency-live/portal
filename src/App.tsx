import { useState } from 'react';
import { Route, Switch, Router } from 'wouter';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import Invite from './pages/Invite';
import PRD from './pages/PRD';

// Get base path from Vite config
const basePath = import.meta.env.BASE_URL;

function Home() {
  const [showMessage, setShowMessage] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowMessage(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-flowency-blue to-flowency-dark flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">
            Flowency Portal
          </h1>
          <p className="text-flowency-electric text-lg">
            Client Collaboration Platform
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          {!showMessage ? (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-500 mb-6">
                Sign in to access your project documents
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="your.email@company.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-flowency-accent focus:border-transparent outline-none transition"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-flowency-accent focus:border-transparent outline-none transition"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-flowency-accent text-white py-3 rounded-lg font-semibold hover:opacity-90 transition shadow-lg"
                >
                  Sign In
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 text-center">
                  Need access?{' '}
                  <a href="https://www.flowency.co.uk/contact" className="text-flowency-accent font-semibold hover:underline">
                    Contact us
                  </a>
                </p>
              </div>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-flowency-electric/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-flowency-electric" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Check Your Email
              </h3>
              <p className="text-gray-600 mb-6">
                Access to the Flowency Portal is provided via secure magic links sent directly to your email.
              </p>
              <div className="bg-flowency-blue/5 border border-flowency-blue/20 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-700">
                  <strong>Don't have a magic link?</strong><br />
                  Contact us at{' '}
                  <a href="mailto:hello@flowency.co.uk" className="text-flowency-accent font-semibold hover:underline">
                    hello@flowency.co.uk
                  </a>
                  {' '}to start working together!
                </p>
              </div>
              <button
                onClick={() => setShowMessage(false)}
                className="text-gray-600 hover:text-gray-800 text-sm font-medium"
              >
                ← Back to login
              </button>
            </div>
          )}
        </div>

        <div className="text-center mt-6">
          <a
            href="https://www.flowency.co.uk"
            className="text-white/80 hover:text-white text-sm font-medium transition"
          >
            Visit Flowency.co.uk →
          </a>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router base={basePath}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/invite/:token" component={Invite} />
          <Route path="/prd" component={PRD} />
          <Route>
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
                <p className="text-gray-600 mb-6">Page not found</p>
                <a href={basePath} className="text-flowency-blue hover:underline">
                  Go Home
                </a>
              </div>
            </div>
          </Route>
        </Switch>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
