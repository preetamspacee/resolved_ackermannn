import React, { useState, useEffect } from 'react';
import { BookOpen, FileText, Folder, TrendingUp, Eye, ThumbsUp, Search, Plus, BarChart3, CheckCircle2, Star, Edit, AlertCircle } from 'lucide-react';
import { knowledgeBaseService } from '../lib/supabaseService';
import { KnowledgeBase } from '../lib/supabase';

const KnowledgePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewArticleModal, setShowNewArticleModal] = useState(false);
  const [showNewCategoryModal, setShowNewCategoryModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeBase | null>(null);
  
  // Dynamic state
  const [articles, setArticles] = useState<KnowledgeBase[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newArticleForm, setNewArticleForm] = useState({
    title: '',
    category: 'Getting Started',
    content: ''
  });
  const [newCategoryForm, setNewCategoryForm] = useState({
    name: '',
    description: ''
  });

  // Load data from Supabase
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [articlesData, categoriesData] = await Promise.all([
          knowledgeBaseService.getArticles(),
          knowledgeBaseService.getCategories()
        ]);
        setArticles(articlesData);
        setCategories(categoriesData);
        setError(null);
      } catch (err) {
        setError('Failed to load knowledge base data');
        console.error('Error loading knowledge base:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleCloseModal = () => {
    setShowNewArticleModal(false);
    setShowNewCategoryModal(false);
    setSelectedArticle(null);
    setNewArticleForm({ title: '', category: 'Getting Started', content: '' });
    setNewCategoryForm({ name: '', description: '' });
  };

  const handleCreateArticle = async () => {
    if (!newArticleForm.title.trim()) {
      alert('Please enter a title for the article');
      return;
    }

    try {
      const newArticle = await knowledgeBaseService.createArticle({
        title: newArticleForm.title,
        content: newArticleForm.content || '',
        category: newArticleForm.category,
        status: 'Draft',
        tags: [],
        featured: false,
        author_id: '11111111-1111-1111-1111-111111111111', // TODO: Use actual user ID from auth
        views: 0,
        helpful_votes: 0,
        not_helpful_votes: 0
      });

      setArticles([newArticle, ...articles]);
      alert('Article created successfully!');
      handleCloseModal();
    } catch (error) {
      console.error('Error creating article:', error);
      alert('Failed to create article. Please try again.');
    }
  };

  const handleCreateCategory = () => {
    if (!newCategoryForm.name.trim()) {
      alert('Please enter a category name');
      return;
    }

    setCategories([...categories, newCategoryForm.name]);
    alert('Category created successfully!');
    handleCloseModal();
  };

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'articles', label: 'Articles', icon: FileText },
    { id: 'categories', label: 'Categories', icon: Folder }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Articles</p>
              <p className="text-2xl font-bold text-gray-900">{articles.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Published</p>
              <p className="text-2xl font-bold text-gray-900">{articles.filter(a => a.status === 'Published').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Eye className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">{articles.reduce((sum, article) => sum + article.views, 0).toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <ThumbsUp className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Feedback</p>
              <p className="text-2xl font-bold text-gray-900">
                {articles.reduce((sum, article) => sum + (article.helpful_votes || 0), 0)}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Featured Articles */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Featured Articles</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {articles.filter(article => article.featured).slice(0, 5).map((article) => (
              <div key={article.id} className="flex items-center space-x-3">
                <Star className="w-5 h-5 text-yellow-500" />
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">{article.title}</h4>
                  <p className="text-sm text-gray-500">{article.category}</p>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Eye className="w-4 h-4" />
                  <span>{article.views}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {articles.slice(0, 5).map((article) => (
              <div key={article.id} className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Edit className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">{article.title}</h4>
                  <p className="text-sm text-gray-500">{article.category} • {new Date(article.created_at).toLocaleDateString()}</p>
                </div>
                <div className={`px-2 py-1 text-xs rounded-full ${
                  article.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {article.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderArticles = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search articles..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={() => setShowNewArticleModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          <span>New Article</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article) => (
          <div key={article.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{article.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{article.category}</p>
                  <p className="text-sm text-gray-700 line-clamp-3">{article.content}</p>
                </div>
                <div className="ml-4 flex flex-col items-end space-y-2">
                  <div className={`px-2 py-1 text-xs rounded-full ${
                    article.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {article.status}
                  </div>
                  {article.featured && <Star className="w-4 h-4 text-yellow-500" />}
                </div>
              </div>
              
              <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>{article.views}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ThumbsUp className="w-4 h-4" />
                    <span>{article.helpful_votes || 0}</span>
                  </div>
                </div>
                <span>{new Date(article.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCategories = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Categories</h2>
        <button
          onClick={() => setShowNewCategoryModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          <span>New Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => {
          const categoryArticles = articles.filter(article => article.category === category);
          return (
            <div key={category} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{category}</h3>
                    <p className="text-sm text-gray-600 mb-4">{categoryArticles.length} articles</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Eye className="w-4 h-4 mr-1" />
                      <span>{categoryArticles.reduce((sum, article) => sum + article.views, 0)} total views</span>
                    </div>
                  </div>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Folder className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Error</h3>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
          <div className="mt-6">
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Knowledge Base</h1>
          <p className="text-gray-600">Manage articles, categories, and analytics</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </div>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'articles' && renderArticles()}
      {activeTab === 'categories' && renderCategories()}

      {/* Modals */}
      {showNewArticleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Create New Article</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Article Title"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={newArticleForm.title}
                onChange={(e) => setNewArticleForm({ ...newArticleForm, title: e.target.value })}
              />
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={newArticleForm.category}
                onChange={(e) => setNewArticleForm({ ...newArticleForm, category: e.target.value })}
              >
                <option value="Getting Started">Getting Started</option>
                <option value="Account Management">Account Management</option>
                <option value="Billing & Payments">Billing & Payments</option>
                <option value="API Documentation">API Documentation</option>
                <option value="Technical Support">Technical Support</option>
              </select>
              <textarea
                placeholder="Article Content"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={4}
                value={newArticleForm.content}
                onChange={(e) => setNewArticleForm({ ...newArticleForm, content: e.target.value })}
              />
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateArticle}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Article
              </button>
            </div>
          </div>
        </div>
      )}

      {showNewCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Create New Category</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Category Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={newCategoryForm.name}
                onChange={(e) => setNewCategoryForm({ ...newCategoryForm, name: e.target.value })}
              />
              <textarea
                placeholder="Category Description"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={3}
                value={newCategoryForm.description}
                onChange={(e) => setNewCategoryForm({ ...newCategoryForm, description: e.target.value })}
              />
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCategory}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgePage;