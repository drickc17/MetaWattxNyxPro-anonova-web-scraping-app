import React, { useState } from 'react';
import { Search, Download, Filter, AlertCircle, Play, Clock, Hash, Users, ArrowRight, CreditCard, Loader, Zap, X, Terminal } from 'lucide-react';
import Button from '../Button';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import LegalNotices from '../LegalNotices';
import { useTranslation } from 'react-i18next';

interface Extraction {
  id: string;
  date: string;
  platform: string;
  type: 'followers' | 'following' | 'hashtag';
  target: string;
  status: 'completed' | 'in_progress' | 'failed';
  progress?: number;
  error?: string;
  lastProcessedId?: string;
  extractedCount?: number;
  totalCount?: number;
}

const OrdersHistory = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { credits, setCredits, hasUsedFreeCredits } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [showContinueModal, setShowContinueModal] = useState(false);
  const [selectedExtraction, setSelectedExtraction] = useState<Extraction | null>(null);
  const [creditsToUse, setCreditsToUse] = useState(500);
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [extractions, setExtractions] = useState<Extraction[]>([]);

  const handleContinueScraping = (extraction: Extraction) => {
    setSelectedExtraction(extraction);
    setShowContinueModal(true);
    // Set initial credits to minimum required
    setCreditsToUse(hasUsedFreeCredits ? 500 : 1);
  };

  const handleStartExtraction = async () => {
    if (!selectedExtraction || !agreedToTerms) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update credits
      setCredits(prev => prev - creditsToUse);
      
      // Close modal and reset state
      setShowContinueModal(false);
      setSelectedExtraction(null);
      setAgreedToTerms(false);
      
      // Navigate to orders page to show progress
      navigate('/dashboard/orders');
    } catch (error) {
      console.error('Extraction error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredExtractions = extractions.filter(extraction => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      extraction.id.toLowerCase().includes(query) ||
      extraction.target.toLowerCase().includes(query) ||
      extraction.type.toLowerCase().includes(query)
    );
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-[#0F0]">{t('dashboard.orders')}</h2>
        <Button>
          <Filter className="w-4 h-4 mr-2" />
          {t('orders.filters')}
        </Button>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-black/40 backdrop-blur-sm border border-[#0F0]/20 rounded-xl p-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('orders.searchPlaceholder')}
            className="w-full bg-black/50 border border-[#0F0]/30 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:border-[#0F0] focus:ring-1 focus:ring-[#0F0] transition-all"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-black/40 backdrop-blur-sm border border-[#0F0]/20 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#0F0]/20">
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0F0]">Order ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0F0]">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0F0]">Platform</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0F0]">Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0F0]">Target</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0F0]">Progress</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0F0]">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0F0]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0F0]/10">
              {filteredExtractions.length > 0 ? (
                filteredExtractions.map((extraction) => (
                  <tr key={extraction.id} className="hover:bg-[#0F0]/5 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-[#0F0]">{extraction.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">{formatDate(extraction.date)}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">{extraction.platform}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      <div className="flex items-center gap-2">
                        {extraction.type === 'hashtag' ? (
                          <Hash className="w-4 h-4" />
                        ) : (
                          <Users className="w-4 h-4" />
                        )}
                        {extraction.type}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">{extraction.target}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {extraction.extractedCount}/{extraction.totalCount}
                    </td>
                    <td className="px-6 py-4">
                      {extraction.status === 'completed' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#0F0]/10 text-[#0F0]">
                          Completed
                        </span>
                      )}
                      {extraction.status === 'in_progress' && (
                        <div className="space-y-1">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-400/10 text-yellow-400">
                            In Progress
                          </span>
                          <div className="w-24 h-1 bg-[#0F0]/20 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[#0F0] transition-all duration-300"
                              style={{ width: `${extraction.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                      {extraction.status === 'failed' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-400/10 text-red-400">
                          Failed
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2">
                        {extraction.status === 'completed' && (
                          <>
                            <Button
                              variant="secondary"
                              className="w-full text-xs bg-[#0F0]/5 hover:bg-[#0F0]/10 border-[#0F0]/30 hover:border-[#0F0]/50 text-[#0F0] transition-all duration-300 flex items-center justify-center gap-1.5"
                            >
                              <Download className="w-3 h-3" />
                              Download CSV
                            </Button>
                            {extraction.extractedCount < extraction.totalCount! && (
                              <Button
                                variant="secondary"
                                className="w-full text-xs bg-black/50 hover:bg-black/70 border-[#0F0]/30 hover:border-[#0F0]/50 text-[#0F0] transition-all duration-300 flex items-center justify-center gap-1.5"
                                onClick={() => handleContinueScraping(extraction)}
                              >
                                <Play className="w-3 h-3" />
                                Continue Scraping
                              </Button>
                            )}
                          </>
                        )}
                        {extraction.status === 'failed' && (
                          <>
                            <div className="w-full px-3 py-1.5 text-xs text-red-400 bg-red-400/5 border border-red-400/30 rounded-lg flex items-center justify-center gap-1.5">
                              <AlertCircle className="w-3 h-3" />
                              {extraction.error}
                            </div>
                            <Button
                              variant="secondary"
                              className="w-full text-xs bg-black/50 hover:bg-black/70 border-[#0F0]/30 hover:border-[#0F0]/50 text-[#0F0] transition-all duration-300 flex items-center justify-center gap-1.5"
                              onClick={() => handleContinueScraping(extraction)}
                            >
                              <Play className="w-3 h-3" />
                              Continue Scraping
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <Terminal className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No extractions found. Start your first extraction!</p>
                    <Button 
                      className="mt-4"
                      onClick={() => navigate('/start-scraping')}
                    >
                      Start Extraction
                    </Button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Continue Scraping Modal */}
      {showContinueModal && selectedExtraction && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => {
              if (!loading) {
                setShowContinueModal(false);
                setSelectedExtraction(null);
                setAgreedToTerms(false);
              }
            }}
          />
          
          <div className="relative bg-black/90 border border-[#0F0]/30 rounded-xl p-8 max-w-lg w-full mx-4">
            <h3 className="text-2xl font-bold text-[#0F0] mb-6">Continue Scraping</h3>
            
            <div className="space-y-6">
              {/* Extraction Details */}
              <div className="p-4 border border-[#0F0]/20 rounded-lg space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Target</span>
                  <span className="text-[#0F0] font-mono">{selectedExtraction.target}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Type</span>
                  <span className="text-[#0F0] font-mono">{selectedExtraction.type}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Progress</span>
                  <span className="text-[#0F0] font-mono">
                    {selectedExtraction.extractedCount}/{selectedExtraction.totalCount}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Remaining</span>
                  <span className="text-[#0F0] font-mono">
                    {selectedExtraction.totalCount! - selectedExtraction.extractedCount!}
                  </span>
                </div>
              </div>

              {/* Credits Input */}
              <div className="space-y-2">
                <label className="block text-sm text-gray-400">Credits to Use</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    value={creditsToUse}
                    onChange={(e) => setCreditsToUse(parseInt(e.target.value) || 0)}
                    min={hasUsedFreeCredits ? 500 : 1}
                    className="w-full bg-black/50 border border-[#0F0]/30 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:border-[#0F0] focus:ring-1 focus:ring-[#0F0] transition-all"
                  />
                </div>
                <div className="text-sm text-gray-400">
                  {hasUsedFreeCredits ? (
                    <>Minimum 500 credits required</>
                  ) : (
                    <>First extraction: Use as little as 1 credit!</>
                  )}
                </div>
              </div>

              {/* Credits Status */}
              <div className="p-4 border border-[#0F0]/20 rounded-lg space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Available Credits</span>
                  <span className="text-[#0F0] font-mono">{credits}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Credits to Use</span>
                  <span className="text-[#0F0] font-mono">{creditsToUse}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Remaining Credits</span>
                  <span className="text-[#0F0] font-mono">{credits - creditsToUse}</span>
                </div>
              </div>

              {/* Legal Notices */}
              <LegalNotices 
                type="extraction"
                checked={agreedToTerms}
                onChange={setAgreedToTerms}
              />

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  className="flex-1"
                  onClick={handleStartExtraction}
                  disabled={
                    loading || 
                    !agreedToTerms || 
                    creditsToUse < (hasUsedFreeCredits ? 500 : 1) ||
                    creditsToUse > credits
                  }
                >
                  {loading ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Start Extraction
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => {
                    if (!loading) {
                      setShowContinueModal(false);
                      setSelectedExtraction(null);
                      setAgreedToTerms(false);
                    }
                  }}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersHistory;
