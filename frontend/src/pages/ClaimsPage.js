import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';

const ClaimsPage = ({ user }) => {
  const [claims, setClaims] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadClaims();
  }, []);

  const loadClaims = async () => {
    try {
      setIsLoading(true);
      const claimsData = await api.getClaims();
      setClaims(claimsData);
    } catch (error) {
      console.error('Failed to load claims');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredClaims = claims.filter(claim => {
    const matchesSearch = claim.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         claim.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'verified') return matchesSearch && claim.credibilityScore > 10;
    if (filter === 'disputed') return matchesSearch && claim.credibilityScore < -5;
    if (filter === 'pending') return matchesSearch && claim.credibilityScore >= -5 && claim.credibilityScore <= 10;
    
    return matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'disputed': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getCredibilityColor = (score) => {
    if (score > 10) return 'text-green-600';
    if (score < -5) return 'text-red-600';
    return 'text-yellow-600';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Community Claims</h1>
            <p className="text-gray-600">Browse and verify claims submitted by the community</p>
          </div>
          
          {user && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/submit-claim"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
              >
                + Submit New Claim
              </Link>
            </motion.div>
          )}
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search claims or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'verified', 'disputed', 'pending'].map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                    filter === filterType
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filterType}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Claims List */}
        <AnimatePresence>
          {filteredClaims.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-600 mb-2">No claims found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your search or be the first to submit a claim!</p>
              {user && (
                <Link
                  to="/submit-claim"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Submit First Claim
                </Link>
              )}
            </motion.div>
          ) : (
            <motion.div
              layout
              className="grid gap-6"
            >
              {filteredClaims.map((claim, index) => (
                <motion.div
                  key={claim.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <Link to={`/claims/${claim.id}`} className="block p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
                          {claim.text}
                        </h3>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          {claim.tags.map(tag => (
                            <span key={tag} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                              #{tag}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-500">
                          <span>By {claim.username}</span>
                          <span className="mx-2">•</span>
                          <span>{new Date(claim.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="text-right ml-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(claim.status)}`}>
                          {claim.status}
                        </span>
                        <div className={`text-2xl font-bold mt-2 ${getCredibilityColor(claim.credibilityScore)}`}>
                          {claim.credibilityScore > 0 ? '+' : ''}{claim.credibilityScore}
                        </div>
                        <div className="text-xs text-gray-500">
                          ↑{claim.upvotes} ↓{claim.downvotes}
                        </div>
                      </div>
                    </div>
                    
                    {claim.sourceUrl && (
                      <a 
                        href={claim.sourceUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-blue-600 hover:text-blue-700 text-sm inline-block"
                      >
                        View Source ↗
                      </a>
                    )}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ClaimsPage;