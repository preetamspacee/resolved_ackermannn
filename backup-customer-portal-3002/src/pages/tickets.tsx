import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { 
  Home as HomeIcon, 
  Ticket as TicketIcon, 
  HelpCircle,
  CreditCard,
  User,
  FileText,
  MessageSquare,
  Download,
  Settings as SettingsIcon,
  Bell,
  Search,
  Plus,
  Clock,
  TrendingUp,
  Star,
  CheckCircle,
  AlertTriangle,
  Activity,
  Phone,
  Mail,
  Calendar,
  Filter,
  SortAsc,
  SortDesc,
  Edit,
  Trash2,
  MessageCircle,
  Paperclip,
  X,
  ChevronDown,
  MoreVertical,
  RefreshCw
} from 'lucide-react';
import { customerTicketService } from '../lib/supabaseService';
import { Ticket, TicketFilters, CreateTicketData } from '../lib/ticketService';
import TicketCreationModal from '../components/TicketCreationModal';
import TicketDetailsModal from '../components/TicketDetailsModal';
import AdvancedTicketFilters from '../components/AdvancedTicketFilters';
import FilterDropdown from '../components/FilterDropdown';
import ModernLayout from '../components/ModernLayout';

const navItems = [
  { href: '/', label: 'Home', icon: HomeIcon },
  { href: '/tickets', label: 'Support Tickets', icon: TicketIcon },
  { href: '/help', label: 'Help Center', icon: HelpCircle },
  { href: '/billing', label: 'Billing', icon: CreditCard },
  { href: '/account', label: 'Account', icon: User },
  { href: '/knowledge', label: 'Knowledge Base', icon: FileText },
  { href: '/ratings', label: 'Ratings', icon: Star },
  { href: '/settings', label: 'Settings', icon: SettingsIcon }
];

const statusOptions = [
  { id: 'open', label: 'Open', color: 'text-red-600 bg-red-100' },
  { id: 'in_progress', label: 'In Progress', color: 'text-yellow-600 bg-yellow-100' },
  { id: 'resolved', label: 'Resolved', color: 'text-green-600 bg-green-100' },
  { id: 'closed', label: 'Closed', color: 'text-gray-600 bg-gray-100' }
];

const priorityOptions = [
  { id: 'low', label: 'Low', color: 'text-blue-600 bg-blue-100' },
  { id: 'medium', label: 'Medium', color: 'text-yellow-600 bg-yellow-100' },
  { id: 'high', label: 'High', color: 'text-orange-600 bg-orange-100' },
  { id: 'urgent', label: 'Urgent', color: 'text-red-600 bg-red-100' }
];

const categoryOptions = [
  { id: 'technical', label: 'Technical' },
  { id: 'billing', label: 'Billing' },
  { id: 'general', label: 'General' },
  { id: 'feature_request', label: 'Feature Request' }
];

export default function TicketsPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [advancedFilters, setAdvancedFilters] = useState<TicketFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [expandedTickets, setExpandedTickets] = useState<Set<string>>(new Set());

  useEffect(() => {
    setIsClient(true);
    console.log('🔍 Tickets page - User state:', user);
    console.log('🔍 Tickets page - Is authenticated:', isAuthenticated);
    loadTickets();
  }, [user, isAuthenticated]);

  useEffect(() => {
    applyFilters();
  }, [tickets, searchQuery, statusFilter, priorityFilter, categoryFilter, advancedFilters, sortBy, sortOrder]);

  const loadTickets = async () => {
    try {
      console.log('🔍 Loading tickets. User:', user);
      
      if (!user) {
        console.log('❌ No user found - tickets cannot be loaded');
        return;
      }

      if (!user.id) {
        console.log('❌ User has no ID - tickets cannot be loaded');
        return;
      }

      console.log('✅ User found with ID:', user.id);
      const allTickets = await customerTicketService.getMyTickets(user.id);
      console.log('📊 Loaded tickets:', allTickets);
      setTickets(allTickets as any);
    } catch (error) {
      console.error('❌ Error loading tickets:', error);
    }
  };

  const applyFilters = () => {
    let filtered = [...tickets];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(ticket =>
        (ticket as any).title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ticket as any).description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ticket as any).id?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter.length > 0) {
      filtered = filtered.filter(ticket => statusFilter.includes(ticket.status));
    }

    // Priority filter
    if (priorityFilter.length > 0) {
      filtered = filtered.filter(ticket => priorityFilter.includes(ticket.priority));
    }

    // Category filter
    if (categoryFilter.length > 0) {
      filtered = filtered.filter(ticket => categoryFilter.includes(ticket.category));
    }

    // Advanced filters
    if (advancedFilters.status?.length) {
      filtered = filtered.filter(ticket => advancedFilters.status!.includes(ticket.status));
    }
    if (advancedFilters.priority?.length) {
      filtered = filtered.filter(ticket => advancedFilters.priority!.includes(ticket.priority));
    }
    if (advancedFilters.category?.length) {
      filtered = filtered.filter(ticket => advancedFilters.category!.includes(ticket.category));
    }
    if (advancedFilters.tags?.length) {
      filtered = filtered.filter(ticket =>
        ticket.tags?.some(tag => advancedFilters.tags!.includes(tag))
      );
    }
    if (advancedFilters.dateRange) {
      const { start, end } = advancedFilters.dateRange;
      filtered = filtered.filter(ticket => {
        const ticketDate = new Date((ticket as any).createdAt);
        return ticketDate >= new Date(start) && ticketDate <= new Date(end);
      });
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof Ticket];
      let bValue: any = b[sortBy as keyof Ticket];

      if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredTickets(filtered);
  };

  const handleCreateTicket = async (data: CreateTicketData) => {
    try {
      console.log('🔍 Ticket creation - User state:', user);
      console.log('🔍 Ticket creation - User ID:', user?.id);
      console.log('🔍 Ticket creation - Is authenticated:', !!user);
      
      if (!user?.id) {
        console.error('❌ User not authenticated - user object:', user);
        alert('Please log in to create a ticket');
        return;
      }

      console.log('Creating ticket with data:', data);
      console.log('User ID:', user.id);

      // Convert to Supabase format
      const ticketData = {
        title: data.subject, // Map subject to title for database
        subject: data.subject, // Also keep subject field
        description: data.description,
        priority: data.priority.charAt(0).toUpperCase() + data.priority.slice(1) as any, // Capitalize
        category: data.category,
        created_by: user.id,
        status: 'Open' as const,
        tags: data.tags || [],
        customer_email: user.email || 'customer@example.com'
      };

      console.log('Ticket data to insert:', ticketData);
      const newTicket = await customerTicketService.createTicket(ticketData);
      console.log('Ticket created successfully:', newTicket);
      
      await loadTickets();
      setShowCreateModal(false);
      alert('Ticket created successfully!');
    } catch (error) {
      console.error('❌ Error creating ticket:', error);
      
      // Show more specific error message
      const errorMessage = error instanceof Error ? error.message : 'Failed to create ticket. Please try again.';
      alert(`❌ ${errorMessage}`);
    }
  };

  const handleViewTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setShowDetailsModal(true);
  };

  const handleApplyAdvancedFilters = (filters: TicketFilters) => {
    setAdvancedFilters(filters);
    setShowFiltersModal(false);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setStatusFilter([]);
    setPriorityFilter([]);
    setCategoryFilter([]);
    setAdvancedFilters({});
  };

  const getStatusColor = (status: string) => {
    const option = statusOptions.find(opt => opt.id === status);
    return option?.color || 'text-gray-600 bg-gray-100';
  };

  const getPriorityColor = (priority: string) => {
    const option = priorityOptions.find(opt => opt.id === priority);
    return option?.color || 'text-gray-600 bg-gray-100';
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (advancedFilters.status?.length) count += advancedFilters.status.length;
    if (advancedFilters.priority?.length) count += advancedFilters.priority.length;
    if (advancedFilters.category?.length) count += advancedFilters.category.length;
    if (advancedFilters.tags?.length) count += advancedFilters.tags.length;
    if (advancedFilters.dateRange) count += 1;
    return count;
  };

  const toggleTicketExpansion = (ticketId: string) => {
    const newExpanded = new Set(expandedTickets);
    if (newExpanded.has(ticketId)) {
      newExpanded.delete(ticketId);
    } else {
      newExpanded.add(ticketId);
    }
    setExpandedTickets(newExpanded);
  };

  const getPaginatedTickets = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredTickets.slice(startIndex, endIndex);
  };

  const getTotalPages = () => {
    return Math.ceil(filteredTickets.length / itemsPerPage);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setExpandedTickets(new Set()); // Clear expanded tickets when changing pages
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-zinc-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ModernLayout>
      <Head>
        <title>Support Tickets - Customer Portal</title>
        <meta name="description" content="Manage your support tickets" />
      </Head>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 dark:bg-zinc-900 dark:border-zinc-800">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">Support Tickets</h1>
                <p className="text-gray-600 dark:text-zinc-400">Manage and track your support requests</p>
              </div>
              {/* Debug info */}
              <div className="text-xs text-gray-500">
                User: {user ? `${user.name} (${user.id})` : 'Not logged in'}
              </div>
              <button
                onClick={() => {
                  console.log('🔍 Create ticket button clicked - User:', user);
                  console.log('🔍 Create ticket button clicked - Is authenticated:', isAuthenticated);
                  setShowCreateModal(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create Ticket
              </button>
            </div>
          </div>
        </header>

        {/* Filters */}
        <div className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 p-6">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Search */}
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search tickets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-zinc-800 dark:text-white"
                />
              </div>
            </div>

            {/* Status Filter */}
            <FilterDropdown
              label="Status"
              options={statusOptions}
              selectedValues={statusFilter}
              onSelectionChange={setStatusFilter}
              multiSelect={true}
            />

            {/* Priority Filter */}
            <FilterDropdown
              label="Priority"
              options={priorityOptions}
              selectedValues={priorityFilter}
              onSelectionChange={setPriorityFilter}
              multiSelect={true}
            />

            {/* Category Filter */}
            <FilterDropdown
              label="Category"
              options={categoryOptions}
              selectedValues={categoryFilter}
              onSelectionChange={setCategoryFilter}
              multiSelect={true}
            />

            {/* Advanced Filters */}
            <button
              onClick={() => setShowFiltersModal(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Advanced
              {getActiveFiltersCount() > 0 && (
                <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1">
                  {getActiveFiltersCount()}
                </span>
              )}
            </button>

            {/* Clear Filters */}
            {(searchQuery || statusFilter.length > 0 || priorityFilter.length > 0 || categoryFilter.length > 0 || getActiveFiltersCount() > 0) && (
              <button
                onClick={clearAllFilters}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Tickets List */}
        <div className="bg-white dark:bg-zinc-900">
          {filteredTickets.length === 0 ? (
            <div className="text-center py-12">
              <TicketIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-zinc-100 mb-2">No tickets found</h3>
              <p className="text-gray-600 dark:text-zinc-400 mb-4">
                {tickets.length === 0 ? "You haven't created any tickets yet." : "Try adjusting your filters."}
              </p>
              {tickets.length === 0 && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Create your first ticket
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-zinc-800">
              {getPaginatedTickets().map((ticket) => (
                <div key={ticket.id} className="p-6 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-zinc-100">
                          {(ticket as any).title || (ticket as any).subject}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                          {statusOptions.find(opt => opt.id === ticket.status)?.label}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                          {priorityOptions.find(opt => opt.id === ticket.priority)?.label}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-zinc-400 mb-3 line-clamp-2">
                        {ticket.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-zinc-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(ticket.createdAt).toLocaleTimeString()}
                        </span>
                        <span>#{ticket.id}</span>
                        {ticket.tags && ticket.tags.length > 0 && (
                          <div className="flex items-center gap-1">
                            {ticket.tags.slice(0, 2).map((tag, index) => (
                              <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-zinc-700 text-xs rounded-full">
                                {tag}
                              </span>
                            ))}
                            {ticket.tags.length > 2 && (
                              <span className="text-xs text-gray-400">+{ticket.tags.length - 2} more</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleTicketExpansion(ticket.id)}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 transition-colors"
                        title={expandedTickets.has(ticket.id) ? "Show less" : "View more"}
                      >
                        <ChevronDown className={`w-4 h-4 transition-transform ${expandedTickets.has(ticket.id) ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Expanded ticket details */}
                  {expandedTickets.has(ticket.id) && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-zinc-700">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-zinc-100 mb-2">Full Description</h4>
                          <p className="text-sm text-gray-600 dark:text-zinc-400">{ticket.description}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-zinc-100 mb-2">Additional Details</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-500 dark:text-zinc-400">Assignee:</span>
                              <span className="text-gray-900 dark:text-zinc-100">{ticket.assignee || 'Unassigned'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500 dark:text-zinc-400">Due Date:</span>
                              <span className="text-gray-900 dark:text-zinc-100">
                                {ticket.dueDate ? new Date(ticket.dueDate).toLocaleDateString() : 'Not set'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500 dark:text-zinc-400">SLA Status:</span>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                ticket.slaStatus === 'on_time' ? 'bg-green-100 text-green-800' :
                                ticket.slaStatus === 'at_risk' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {ticket.slaStatus.replace('_', ' ')}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500 dark:text-zinc-400">Comments:</span>
                              <span className="text-gray-900 dark:text-zinc-100">{ticket.comments.length}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500 dark:text-zinc-400">Attachments:</span>
                              <span className="text-gray-900 dark:text-zinc-100">{ticket.attachments.length}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Tags */}
                      {ticket.tags && ticket.tags.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-zinc-100 mb-2">Tags</h4>
                          <div className="flex flex-wrap gap-2">
                            {ticket.tags.map((tag, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Recent Comments */}
                      {ticket.comments && ticket.comments.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-zinc-100 mb-2">Recent Comments</h4>
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            {ticket.comments.slice(0, 3).map((comment) => (
                              <div key={comment.id} className="p-2 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                                <div className="flex justify-between items-start mb-1">
                                  <span className="text-xs font-medium text-gray-900 dark:text-zinc-100">
                                    {comment.author}
                                  </span>
                                  <span className="text-xs text-gray-500 dark:text-zinc-400">
                                    {new Date(comment.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-600 dark:text-zinc-400 line-clamp-2">
                                  {comment.content}
                                </p>
                              </div>
                            ))}
                            {ticket.comments.length > 3 && (
                              <p className="text-xs text-gray-500 dark:text-zinc-400 text-center">
                                +{ticket.comments.length - 3} more comments
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredTickets.length > itemsPerPage && (
          <div className="bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700 dark:text-zinc-300">Show:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-2 py-1 border border-gray-300 dark:border-zinc-600 rounded text-sm dark:bg-zinc-800 dark:text-zinc-100"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-sm text-gray-700 dark:text-zinc-300">per page</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700 dark:text-zinc-300">
                  Page {currentPage} of {getTotalPages()}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-2 py-1 text-sm border border-gray-300 dark:border-zinc-600 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-zinc-800"
                  >
                    Previous
                  </button>
                  {Array.from({ length: getTotalPages() }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-2 py-1 text-sm border rounded ${
                        page === currentPage
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 dark:border-zinc-600 hover:bg-gray-50 dark:hover:bg-zinc-800'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === getTotalPages()}
                    className="px-2 py-1 text-sm border border-gray-300 dark:border-zinc-600 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-zinc-800"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <TicketCreationModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateTicket}
        />
      )}

      {showDetailsModal && selectedTicket && (
        <TicketDetailsModal
          ticket={selectedTicket}
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          onUpdate={() => {}}
          onAddComment={() => {}}
        />
      )}

      {showFiltersModal && (
        <AdvancedTicketFilters
          filters={advancedFilters}
          onClose={() => setShowFiltersModal(false)}
          onApply={handleApplyAdvancedFilters}
        />
      )}
    </ModernLayout>
  );
}
