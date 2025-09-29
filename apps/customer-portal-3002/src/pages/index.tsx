import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ModernLayout from '../components/ModernLayout';
import { useAuth } from '../contexts/AuthContext';
import { 
  Plus,
  Ticket,
  Star,
  Server,
  HelpCircle,
  Bell,
  Search,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  MessageCircle,
  Paperclip
} from 'lucide-react';

// Utility function for time formatting
const formatTimeAgo = (timestamp: string) => {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

// Dashboard component
const Dashboard: React.FC = () => {
  const { user, login } = useAuth();
  const [isClient, setIsClient] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    console.log('🔍 Dashboard: User data:', user);
    
    // Check if this is the first visit (one-time refresh only)
    const hasRefreshedBefore = localStorage.getItem('customer_portal_refreshed');
    
    // Force refresh if no user is logged in (regardless of redirect flag)
    if (!user) {
      console.log('🔍 No user logged in - checking refresh conditions');
      
      // If no refresh flag exists, this is a first visit
      if (!hasRefreshedBefore) {
        console.log('🔍 First visit detected - refreshing page once');
        localStorage.setItem('customer_portal_refreshed', 'true');
        
        // Auto-refresh the page once, then redirect
        const refreshTimer = setTimeout(() => {
          console.log('🔍 Auto-refreshing customer portal');
          // First refresh the page
          window.location.reload();
          
          // Then redirect to welcome page after refresh
          setTimeout(() => {
            console.log('🔍 Redirecting to welcome page after refresh');
            window.location.href = 'http://localhost:3001/welcome';
          }, 2000); // Redirect after 2 seconds
        }, 1000); // Refresh after 1 second
        
        return () => {
          clearTimeout(refreshTimer);
        };
      } else {
        console.log('🔍 User has been refreshed before - staying on customer portal');
      }
    } else {
      console.log('🔍 User is logged in - staying on customer portal');
    }
  }, [user]);

  // Mock data for demonstration
  const stats = {
    openTickets: 3,
    inProgressTickets: 2,
    resolvedTickets: 15,
    totalTickets: 20
  };

  const recentTickets = [
    {
      id: 'T-001',
      title: 'Login issues with mobile app',
      status: 'open',
      priority: 'high',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T14:20:00Z'
    },
    {
      id: 'T-002',
      title: 'Password reset not working',
      status: 'in-progress',
      priority: 'medium',
      createdAt: '2024-01-14T16:45:00Z',
      updatedAt: '2024-01-15T09:15:00Z'
    },
    {
      id: 'T-003',
      title: 'Feature request: Dark mode',
      status: 'resolved',
      priority: 'low',
      createdAt: '2024-01-13T11:20:00Z',
      updatedAt: '2024-01-14T15:30:00Z'
    }
  ];

  const handleAddComment = (ticketId: string) => {
    setShowCommentBox(ticketId);
    setCommentText('');
  };

  const handleSubmitComment = (ticketId: string) => {
    if (commentText.trim()) {
      alert(`Comment added to ticket ${ticketId}: "${commentText}"`);
      setShowCommentBox(null);
      setCommentText('');
    }
  };

  const handleCancelComment = () => {
    setShowCommentBox(null);
    setCommentText('');
  };

  const quickActions = [
    {
      name: 'View Tickets',
      icon: Ticket,
      action: () => router.push('/tickets'),
      description: 'Check your support requests'
    },
    {
      name: 'Rate Service',
      icon: Star,
      action: () => router.push('/ratings'),
      description: 'Rate your experience'
    },
    {
      name: 'System Status',
      icon: Server,
      action: () => router.push('/services'),
      description: 'Check service status'
    },
    {
      name: 'Get Help',
      icon: HelpCircle,
      action: () => router.push('/help'),
      description: 'Find answers and support'
    }
  ];

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ModernLayout>
      <Head>
        <title>Customer Portal - Dashboard</title>
        <meta name="description" content="BSM Customer Portal Dashboard" />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user?.name || 'User'}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your support tickets and access our services
          </p>
          
          {/* Redirect Notice - Only show when redirect is about to happen */}
          {!user && !localStorage.getItem('customer_portal_redirected') && (
            <div className="mt-4 p-3 bg-blue-100 border border-blue-300 rounded-lg">
              <p className="text-blue-800 text-sm">
                🔄 Redirecting to Admin Dashboard Welcome Page in a moment...
              </p>
            </div>
          )}
          
          {/* Welcome back message for returning users */}
          {!user && localStorage.getItem('customer_portal_redirected') && (
            <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg">
              <p className="text-green-800 text-sm">
                👋 Welcome back! You can now use the customer portal normally.
              </p>
            </div>
          )}
          
          {/* Hidden Auto-Redirect Button */}
          <button
            id="auto-redirect-btn"
            onClick={() => {
              window.location.href = 'http://localhost:3001/welcome';
            }}
            className="hidden"
            style={{ display: 'none' }}
          >
            Go to Welcome Page
          </button>

          {/* Clear Cache Button */}
          {!user && (
            <div className="mb-4 space-x-2">
              <button
                onClick={() => {
                  // Clear all localStorage data
                  localStorage.clear();
                  alert('✅ Cache cleared! Next visit will redirect to welcome page.');
                  window.location.reload();
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-xs font-medium"
              >
                🗑️ Clear Cache & Refresh
              </button>
            </div>
          )}

          {/* Debug Login Buttons */}
          {!user && (
            <div className="mt-4 space-y-2">
              <button
                onClick={async () => {
                  try {
                    // Use existing user from Supabase
                    const testUser = {
                      id: '22222222-2222-2222-2222-222222222222', // John Doe from your database
                      email: 'john.doe@techcorp.com',
                      name: 'John Doe',
                      accountType: 'Customer' as const,
                      verified: true,
                      authMethod: 'email' as const
                    };
                    login(testUser);
                    alert('✅ Logged in as John Doe! You can now create tickets.');
                  } catch (error) {
                    console.error('Login error:', error);
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium block w-full"
              >
                🔧 Login as John Doe (TechCorp Customer)
              </button>
              
              <button
                onClick={() => {
                  const testUser = {
                    id: '33333333-3333-3333-3333-333333333333', // Jane Smith from your database
                    email: 'jane.smith@startupxyz.com',
                    name: 'Jane Smith',
                    accountType: 'Customer' as const,
                    verified: true,
                    authMethod: 'email' as const
                  };
                  login(testUser);
                  alert('✅ Logged in as Jane Smith! You can now create tickets.');
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium block w-full"
              >
                🔧 Login as Jane Smith (StartupXYZ Customer)
              </button>
              
              <button
                onClick={() => {
                  // Create a timestamp-based user but handle the foreign key issue
                  const testUser = {
                    id: '44444444-4444-4444-4444-444444444444', // Will fail foreign key constraint
                    email: 'test@example.com',
                    name: 'Test Customer',
                    accountType: 'Customer' as const,
                    verified: true,
                    authMethod: 'email' as const
                  };
                  login(testUser);
                  alert('✅ Logged in as Test Customer! You can now create tickets.');
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium block w-full"
              >
                🔧 Login as Test Customer (May Fail - For Testing)
              </button>
            </div>
          )}
          
          {/* Show current user info */}
          {user && (
            <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg">
              <p className="text-green-800 text-sm">
                ✅ Logged in as: <strong>{user.name}</strong> ({user.email})
              </p>
              <p className="text-green-700 text-xs mt-1">
                You can now create tickets and access all features.
              </p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className="group bg-blue-600 hover:bg-blue-700 rounded-lg p-6 text-white hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <action.icon className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold">{action.name}</h3>
                  <p className="text-blue-100 text-sm">{action.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Open</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.openTickets}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.inProgressTickets}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Resolved</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.resolvedTickets}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalTickets}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Tickets */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Tickets</h2>
            <Link
              href="/tickets"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              View All
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentTickets.map((ticket) => (
              <div key={ticket.id}>
                <div
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-medium text-gray-900 dark:text-white">{ticket.title}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        ticket.status === 'open' 
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : ticket.status === 'in-progress'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {ticket.status.replace('-', ' ')}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        ticket.priority === 'high' 
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : ticket.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      }`}>
                        {ticket.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Created {formatTimeAgo(ticket.createdAt)} • Updated {formatTimeAgo(ticket.updatedAt)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleAddComment(ticket.id)}
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      title="Add comment"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => {
                        const fileInput = document.createElement('input');
                        fileInput.type = 'file';
                        fileInput.onchange = (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0];
                          if (file) {
                            alert(`File "${file.name}" attached to ticket ${ticket.id}`);
                          }
                        };
                        fileInput.click();
                      }}
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      title="Attach file"
                    >
                      <Paperclip className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {/* Comment Box */}
                {showCommentBox === ticket.id && (
                  <div className="mt-3 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-slate-600">
                    <div className="mb-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Add a comment to ticket {ticket.id}:
                      </label>
                      <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Type your comment here..."
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-800 dark:text-white resize-none"
                        rows={3}
                        autoFocus
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={handleCancelComment}
                        className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSubmitComment(ticket.id)}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        Add Comment
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

    </ModernLayout>
  );
};

export default Dashboard;