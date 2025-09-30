import React, { useState, useEffect } from 'react';
import { 
  Ticket, 
  Plus, 
  Filter, 
  Search, 
  MoreVertical, 
  Clock, 
  User, 
  AlertCircle,
  CheckCircle,
  XCircle,
  MessageSquare,
  Mail,
  Phone,
  Slack,
  Zap,
  Brain,
  Bot,
  UserCheck,
  Eye,
  Edit,
  Trash2,
  Copy,
  UserPlus,
  TrendingUp,
  X,
  RefreshCw
} from 'lucide-react';
import HumanApprovalChamber from '../components/HumanApprovalChamber';
import { ticketService } from '../lib/supabaseService';

interface Ticket {
  id: string;
  subject: string;
  description: string;
  priority: string;
  status: string;
  category: string;
  channel: string;
  assignee: string;
  requester: string;
  created: string;
  updated: string;
  sla: string;
  tags: string[];
  aiInsights?: string;
  sentiment: string;
  approvalMethod: string;
  approvedBy?: string;
  approvedAt?: string | null;
  ruleUsed?: string;
}

// Dynamic ticket loading from Supabase
export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showApprovalChamber, setShowApprovalChamber] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [pendingTickets, setPendingTickets] = useState<Ticket[]>([]);
  const [showTicketDetails, setShowTicketDetails] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState<Ticket | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Keep pending tickets in sync with current tickets
  useEffect(() => {
    const pending = tickets.filter(ticket =>
      ticket.status === 'Pending' && ticket.approvalMethod === 'human'
    );
    setPendingTickets(pending);
  }, [tickets]);

  // Load tickets from Supabase
  const loadTickets = async () => {
    try {
      setLoading(true);
      console.log('🔍 Loading tickets from Supabase...');
      const data = await ticketService.getTickets();
      console.log('✅ Loaded tickets:', data);
      
      // Transform Supabase data to match our interface
      const transformedTickets: Ticket[] = data.map((ticket: any) => ({
        id: ticket.id,
        subject: ticket.title || ticket.subject,
        description: ticket.description,
        priority: ticket.priority,
        status: ticket.status,
        category: ticket.category,
        channel: 'Web Portal',
        assignee: ticket.assigned_user?.name || '',
        requester: ticket.created_user?.name || 'Customer',
        created: new Date(ticket.created_at).toLocaleString(),
        updated: new Date(ticket.updated_at).toLocaleString(),
        sla: '24 hours',
        tags: ticket.tags || [],
        aiInsights: 'Auto-generated from customer request',
        sentiment: 'Neutral',
        approvalMethod: 'auto',
        approvedBy: '',
        approvedAt: null
      }));
      
      setTickets(transformedTickets);
      setError(null);
    } catch (err) {
      console.error('❌ Error loading tickets:', err);
      setError('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
    
    // Refresh tickets every 30 seconds for real-time updates
    const interval = setInterval(loadTickets, 30000);
    return () => clearInterval(interval);
  }, []);

  // Filter tickets
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = searchQuery === '' || 
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesPriority = priorityFilter === 'all' || ticket.priority.toLowerCase() === priorityFilter.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading tickets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={loadTickets}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Mock data for demonstration (fallback)
  const mockTicketData: Ticket[] = [
  {
    id: 'TCK-2024-P001',
    subject: 'Emergency server access request for production database',
    description: 'Need immediate access to production database to fix critical bug affecting customer transactions. This requires emergency approval.',
    priority: 'Critical',
    status: 'Pending',
    category: 'IT Support',
    channel: 'Phone',
    assignee: '',
    requester: 'DevOps Team Lead',
    created: '2024-01-15 16:30',
    updated: '2024-01-15 16:30',
    sla: '30 minutes',
    tags: ['Emergency', 'Database', 'Production', 'Critical'],
    aiInsights: 'High-risk access request. Requires manual review due to production environment.',
    sentiment: 'Urgent',
    approvalMethod: 'human',
    approvedBy: '',
    approvedAt: null
  },
  {
    id: 'TCK-2024-P002',
    subject: 'Budget approval for new software licenses - $15,000',
    description: 'Request for 100 licenses of new design software. Total cost is $15,000 which exceeds auto-approval limit of $10,000.',
    priority: 'High',
    status: 'Pending',
    category: 'Procurement',
    channel: 'Email',
    assignee: '',
    requester: 'Marketing Director',
    created: '2024-01-15 15:45',
    updated: '2024-01-15 15:45',
    sla: '4 hours',
    tags: ['Budget', 'Software', 'Licenses', 'High Value'],
    aiInsights: 'Exceeds auto-approval threshold. Requires financial review.',
    sentiment: 'Neutral',
    approvalMethod: 'human',
    approvedBy: '',
    approvedAt: null
  },
  {
    id: 'TCK-2024-P003',
    subject: 'Security policy exception request for third-party integration',
    description: 'Request to allow external API access for new customer integration. This requires security team review and approval.',
    priority: 'High',
    status: 'Pending',
    category: 'Security',
    channel: 'Portal',
    assignee: '',
    requester: 'Integration Team',
    created: '2024-01-15 14:20',
    updated: '2024-01-15 14:20',
    sla: '2 hours',
    tags: ['Security', 'API', 'Integration', 'Policy Exception'],
    aiInsights: 'Security-sensitive request. Requires manual security review.',
    sentiment: 'Neutral',
    approvalMethod: 'human',
    approvedBy: '',
    approvedAt: null
  },
  {
    id: 'TCK-2024-001',
    subject: 'VPN connectivity issues affecting remote workers',
    description: 'Users unable to connect to corporate VPN from home office',
    priority: 'High',
    status: 'Open',
    category: 'IT Support',
    channel: 'Email',
    assignee: 'John Doe',
    requester: 'Sarah Johnson',
    created: '2024-01-15 09:30',
    updated: '2024-01-15 14:20',
    sla: '4 hours',
    tags: ['VPN', 'Remote Work', 'Network'],
    aiInsights: 'Similar issues reported 3 times this week. Check firewall rules.',
    sentiment: 'Frustrated',
    approvalMethod: 'human',
    approvedBy: 'John Doe',
    approvedAt: null
  },
  {
    id: 'TCK-2024-002',
    subject: 'Email server maintenance scheduled',
    description: 'Scheduled maintenance for email server to apply security patches and performance updates.',
    priority: 'Medium',
    status: 'Approved',
    category: 'System Maintenance',
    channel: 'Portal',
    assignee: 'Jane Smith',
    requester: 'IT Operations',
    created: '2024-01-15 08:00',
    updated: '2024-01-15 16:45',
    sla: '24 hours',
    tags: ['Email', 'Maintenance', 'Scheduled'],
    aiInsights: 'Routine maintenance. No impact expected.',
    sentiment: 'Neutral',
    approvalMethod: 'rule',
    approvedBy: 'Rules Engine',
    approvedAt: '2024-01-15 08:05',
    ruleUsed: 'R-003: Standard Service Request Approval'
  },
  {
    id: 'TCK-2024-003',
    subject: 'New employee onboarding workflow',
    description: 'Request to create a new onboarding workflow for incoming employees including IT setup, access provisioning, and training schedules.',
    priority: 'Low',
    status: 'Approved',
    category: 'HR',
    channel: 'Slack',
    assignee: 'Mike Johnson',
    requester: 'HR Department',
    created: '2024-01-14 10:15',
    updated: '2024-01-15 11:30',
    sla: '48 hours',
    tags: ['Onboarding', 'HR', 'Workflow'],
    aiInsights: 'Standard onboarding process completed successfully.',
    sentiment: 'Positive',
    approvalMethod: 'human',
    approvedBy: 'Mike Johnson',
    approvedAt: '2024-01-14 10:45'
  },
  {
    id: 'TCK-2024-004',
    subject: 'Software license renewal - Adobe Creative Suite',
    description: 'Renewal request for Adobe Creative Suite licenses for the marketing team. Current licenses expire in 3 days.',
    priority: 'High',
    status: 'Approved',
    category: 'Procurement',
    channel: 'Phone',
    assignee: 'Sarah Wilson',
    requester: 'Marketing Team',
    created: '2024-01-15 13:20',
    updated: '2024-01-15 13:20',
    sla: '2 hours',
    tags: ['License', 'Adobe', 'Renewal'],
    aiInsights: 'Urgent: License expires in 3 days. Expedite approval.',
    sentiment: 'Urgent',
    approvalMethod: 'rule',
    approvedBy: 'Rules Engine',
    approvedAt: '2024-01-15 13:21',
    ruleUsed: 'R-001: High Priority Ticket Auto-Approval'
  },
  {
    id: 'TCK-2024-005',
    subject: 'Office supplies request - Stationery',
    description: 'Request for office stationery supplies including pens, notebooks, and printer paper for the office.',
    priority: 'Low',
    status: 'Approved',
    category: 'Procurement',
    channel: 'Portal',
    assignee: 'Procurement Team',
    requester: 'Office Manager',
    created: '2024-01-15 14:00',
    updated: '2024-01-15 14:02',
    sla: '24 hours',
    tags: ['Supplies', 'Stationery', 'Office'],
    aiInsights: 'Standard office supplies request under budget limit.',
    sentiment: 'Neutral',
    approvalMethod: 'rule',
    approvedBy: 'Rules Engine',
    approvedAt: '2024-01-15 14:02',
    ruleUsed: 'R-003: Standard Service Request Approval'
  },
  {
    id: 'TCK-2024-006',
    subject: 'Security incident - Unauthorized access attempt',
    description: 'Multiple failed login attempts detected from suspicious IP addresses. Security team investigation required.',
    priority: 'Critical',
    status: 'Escalated',
    category: 'Security',
    channel: 'Email',
    assignee: 'Security Team',
    requester: 'System Admin',
    created: '2024-01-15 15:30',
    updated: '2024-01-15 15:35',
    sla: '1 hour',
    tags: ['Security', 'Incident', 'Critical'],
    aiInsights: 'Critical security incident detected. Immediate attention required.',
    sentiment: 'Critical',
    approvalMethod: 'rule',
    approvedBy: 'Rules Engine',
    approvedAt: '2024-01-15 15:31',
    ruleUsed: 'R-002: Security Issue Escalation'
  }
];

const channelIcons: { [key: string]: any } = {
  Email: Mail,
  Portal: MessageSquare,
  Slack: Slack,
  Phone: Phone
};

const priorityColors: { [key: string]: string } = {
  High: 'bg-red-100 text-red-800',
  Medium: 'bg-blue-100 text-blue-800',
  Low: 'bg-green-100 text-green-800'
};

const statusColors: { [key: string]: string } = {
  Open: 'bg-blue-100 text-blue-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  Approved: 'bg-green-100 text-green-800',
  Resolved: 'bg-green-100 text-green-800',
  Closed: 'bg-gray-100 text-gray-800',
  Escalated: 'bg-red-100 text-red-800'
};
  

  // Handlers for Human Approval Chamber
  const handleApproveTicket = async (ticketId: string) => {
    console.log(`Approving ticket: ${ticketId}`);
    try {
      await ticketService.updateTicket(ticketId, { status: 'Resolved' });
      loadTickets(); // Refresh the list
    } catch (error) {
      console.error('Error approving ticket:', error);
    }
  };

  const handleRejectTicket = async (ticketId: string) => {
    console.log(`Rejecting ticket: ${ticketId}`);
    try {
      await ticketService.updateTicket(ticketId, { status: 'Closed' });
      loadTickets(); // Refresh the list
    } catch (error) {
      console.error('Error rejecting ticket:', error);
    }
  };

  const handleViewTicketDetails = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setShowTicketDetails(true);
    setActiveDropdown(null);
  };

  const handleEditTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setShowEditModal(true);
    setActiveDropdown(null);
  };

  const handleDeleteTicket = (ticket: Ticket) => {
    setTicketToDelete(ticket);
    setShowDeleteConfirm(true);
    setActiveDropdown(null);
  };

  const confirmDeleteTicket = async () => {
    if (ticketToDelete) {
      try {
        await ticketService.deleteTicket(ticketToDelete.id);
        loadTickets(); // Refresh the list
      setShowDeleteConfirm(false);
      setTicketToDelete(null);
      } catch (error) {
        console.error('Error deleting ticket:', error);
      }
    }
  };

  const handleSaveTicket = async () => {
    if (selectedTicket) {
      try {
        await ticketService.updateTicket(selectedTicket.id, {
          title: selectedTicket.subject,
          description: selectedTicket.description,
          status: selectedTicket.status as any,
          priority: selectedTicket.priority as any,
          category: selectedTicket.category
        });
        loadTickets(); // Refresh the list
        setShowEditModal(false);
        setSelectedTicket(null);
      } catch (error) {
        console.error('Error updating ticket:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    return statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    return priorityColors[priority as keyof typeof priorityColors] || 'bg-gray-100 text-gray-800';
  };

  const getChannelIcon = (channel: string) => {
    switch (channel.toLowerCase()) {
      case 'email': return <Mail className="w-4 h-4" />;
      case 'phone': return <Phone className="w-4 h-4" />;
      case 'slack': return <Slack className="w-4 h-4" />;
      case 'web portal': return <Ticket className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      case 'urgent': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };


  return (
    <div className="min-h-screen bg-gray-50">
        {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Ticket className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Support Tickets</h1>
          </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={loadTickets}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
          <button 
            onClick={() => setShowCreateModal(true)}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
          >
                <Plus className="w-4 h-4 mr-2" />
                Create Ticket
          </button>
        </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search tickets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="pending">Pending</option>
              <option value="in progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
                </div>
              </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Open Tickets</p>
                <p className="text-2xl font-bold text-gray-900">
                  {tickets.filter(t => t.status === 'Open').length}
                </p>
                </div>
              </div>
            </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="w-8 h-8 text-yellow-600" />
                </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {tickets.filter(t => t.status === 'In Progress').length}
                </p>
              </div>
            </div>
                </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Resolved</p>
                <p className="text-2xl font-bold text-gray-900">
                  {tickets.filter(t => t.status === 'Resolved').length}
                </p>
            </div>
          </div>
        </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="w-8 h-8 text-blue-600" />
      </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Tickets</p>
                <p className="text-2xl font-bold text-gray-900">{tickets.length}</p>
                    </div>
                        </div>
        </div>
      </div>

      {/* Tickets Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ticket
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Requester
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
              </tr>
            </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                        <div className="text-sm font-medium text-gray-900">{ticket.subject}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{ticket.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {ticket.requester}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ticket.created}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleViewTicketDetails(ticket)}
                          className="text-blue-600 hover:text-blue-900"
                              >
                          <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleEditTicket(ticket)}
                          className="text-green-600 hover:text-green-900"
                              >
                          <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteTicket(ticket)}
                          className="text-red-600 hover:text-red-900"
                              >
                          <Trash2 className="w-4 h-4" />
                              </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

        {/* Empty State */}
        {filteredTickets.length === 0 && (
          <div className="text-center py-12">
            <Ticket className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
            <p className="text-gray-500">Try adjusting your search or filters.</p>
        </div>
      )}
                </div>

      {/* Human Approval Chamber */}
      {showApprovalChamber && (
        <HumanApprovalChamber
          pendingTickets={pendingTickets}
          onApprove={handleApproveTicket}
          onReject={handleRejectTicket}
          onViewDetails={handleViewTicketDetails}
        />
      )}

      {/* Ticket Details Modal */}
      {showTicketDetails && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Ticket Details</h2>
              <button
                onClick={() => setShowTicketDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <p className="text-gray-900">{selectedTicket.subject}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <p className="text-gray-900">{selectedTicket.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedTicket.status)}`}>
                    {selectedTicket.status}
                  </span>
              </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(selectedTicket.priority)}`}>
                    {selectedTicket.priority}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Requester</label>
                  <p className="text-gray-900">{selectedTicket.requester}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Created</label>
                  <p className="text-gray-900">{selectedTicket.created}</p>
                </div>
                </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Ticket Modal */}
      {showEditModal && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Edit Ticket</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  value={selectedTicket.subject}
                  onChange={(e) => setSelectedTicket({...selectedTicket, subject: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={selectedTicket.description}
                  onChange={(e) => setSelectedTicket({...selectedTicket, description: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={selectedTicket.priority}
                    onChange={(e) => setSelectedTicket({...selectedTicket, priority: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={selectedTicket.status}
                    onChange={(e) => setSelectedTicket({...selectedTicket, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTicket}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && ticketToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Delete Ticket</h2>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
      </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete ticket "{ticketToDelete.subject}"? This action cannot be undone.
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteTicket}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
