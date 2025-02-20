import React from 'react';
import { Zap, Download, CreditCard, Shield, PlayCircle, Users, Terminal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../Button';
import GlitchText from '../GlitchText';
import { useUser } from '../../contexts/UserContext';
import { useOnboarding } from '../../contexts/OnboardingContext';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';

const DashboardHome = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { credits, currentPlan = 'Free Plan' } = useUser();
  const { setShowOnboarding } = useOnboarding();
  const { user } = useAuth();
  const discordUrl = 'https://discord.gg/your-discord-invite';

  // Get user's name from auth context
  const userName = user?.user_metadata?.first_name || 'User';

  const quickActions = [
    { 
      icon: Zap, 
      label: 'Start New Extraction', 
      color: 'text-yellow-400',
      onClick: () => navigate('/start-scraping')
    },
    { 
      icon: Download, 
      label: 'Download Data', 
      color: 'text-blue-400',
      onClick: () => navigate('/dashboard/export')
    },
    { 
      icon: CreditCard, 
      label: 'Buy Credits', 
      color: 'text-purple-400',
      onClick: () => navigate('/dashboard/credits')
    },
    { 
      icon: Shield, 
      label: 'Security Settings', 
      color: 'text-green-400',
      onClick: () => navigate('/dashboard/settings')
    },
  ];

  // Calculate credit usage percentage
  const maxCredits = 500;
  const creditPercentage = Math.min((credits / maxCredits) * 100, 100);

  return (
    <div className="space-y-8">
      {/* Welcome Message */}
      <div className="mb-8">
        <GlitchText 
          text={t('dashboard.welcome', { name: userName })}
          className="text-4xl font-bold mb-4"
        />
        <p className="text-gray-400">{t('dashboard.subtitle')}</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <Button
            key={index}
            variant="secondary"
            className="h-32 flex flex-col items-center justify-center gap-4 group"
            onClick={action.onClick}
          >
            <action.icon className={`w-8 h-8 ${action.color} group-hover:scale-110 transition-transform`} />
            <span className="text-sm">{action.label}</span>
          </Button>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Credits Usage */}
        <div className="bg-black/40 backdrop-blur-sm border border-[#0F0]/20 rounded-xl p-6 hover:border-[#0F0]/50 transition-all">
          <h3 className="text-[#0F0] text-lg mb-4">Credits Usage</h3>
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block text-[#0F0]">
                  {creditPercentage.toFixed(0)}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 text-xs flex rounded bg-[#0F0]/10">
              <div
                style={{ width: `${creditPercentage}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#0F0]"
              />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <p className="text-sm text-gray-400">
              {credits} credits remaining
            </p>
            <p className="text-sm text-[#0F0]">
              Current Plan: {currentPlan}
            </p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-black/40 backdrop-blur-sm border border-[#0F0]/20 rounded-xl p-6 hover:border-[#0F0]/50 transition-all col-span-2">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-[#0F0] text-lg">Recent Activity</h3>
            <div className="flex items-center gap-4">
              <Button
                variant="secondary"
                className="text-sm px-3 py-1.5"
                onClick={() => setShowOnboarding(true)}
              >
                <PlayCircle className="w-4 h-4 mr-1" />
                Watch Tutorial
              </Button>
              <a 
                href={discordUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-[#0F0] transition-all duration-300 group"
              >
                <Button variant="secondary" className="text-sm px-3 py-1.5">
                  <Users className="w-4 h-4 mr-1 group-hover:text-[#0F0] group-hover:animate-pulse transition-all duration-300" />
                  Community
                </Button>
              </a>
            </div>
          </div>

          {/* Empty State */}
          <div className="text-center py-12">
            <Terminal className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No recent activity. Start your first extraction!</p>
            <Button 
              className="mt-4"
              onClick={() => navigate('/start-scraping')}
            >
              Start Extraction
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
