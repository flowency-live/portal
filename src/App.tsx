import { Route, Switch } from 'wouter';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import Invite from './pages/Invite';
import PRD from './pages/PRD';

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-flowency-blue to-flowency-dark flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Flowency Portal
          </h1>
          <p className="text-gray-600 mb-6">
            Welcome to the Flowency client collaboration portal. Please use the magic link provided to access your documents.
          </p>
          <a
            href="https://www.flowency.co.uk"
            className="inline-block bg-flowency-accent text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition"
          >
            Visit Flowency
          </a>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/invite/:token" component={Invite} />
        <Route path="/prd" component={PRD} />
        <Route>
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
              <p className="text-gray-600 mb-6">Page not found</p>
              <a href="/" className="text-flowency-blue hover:underline">
                Go Home
              </a>
            </div>
          </div>
        </Route>
      </Switch>
    </QueryClientProvider>
  );
}

export default App;
