import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Terminal, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const Header = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const { t } = useTranslation();
  const discordUrl = 'https://discord.gg/your-discord-invite';

  // Don't show header on dashboard pages since they have their own navigation
  if (location.pathname.startsWith('/dashboard')) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-sm border-b border-[#0F0]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          <Link 
            to="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Terminal className="w-6 h-6 text-[#0F0]" />
            <span className="text-[#0F0] font-bold">ANONOVA</span>
          </Link>

          <div className="flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard"
                  className="text-base text-[#0F0] hover:text-[#0F0]/80 transition-all duration-300 hover:animate-[glitch_0.3s_ease-in-out] relative after:absolute after:inset-0 after:bg-[#0F0]/20 after:blur-lg after:opacity-0 hover:after:opacity-100 after:transition-opacity"
                >
                  {t('header.dashboard')}
                </Link>
                <Link 
                  to="/start-scraping"
                  className="text-base text-[#0F0] hover:text-[#0F0]/80 transition-all duration-300 hover:animate-[glitch_0.3s_ease-in-out]"
                >
                  {t('header.newExtraction')}
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to="/features"
                  className="text-base text-gray-400 hover:text-[#0F0] transition-colors"
                >
                  {t('header.features')}
                </Link>
                <Link 
                  to="/pricing"
                  className="text-base text-gray-400 hover:text-[#0F0] transition-colors"
                >
                  {t('header.pricing')}
                </Link>
                <Link 
                  to="/start-scraping"
                  className="text-base text-[#0F0] hover:opacity-80 transition-opacity"
                >
                  {t('header.startScraping')}
                </Link>
              </>
            )}
            <a 
              href={discordUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-base text-gray-400 hover:text-[#0F0] transition-all duration-300 group"
            >
              <Users className="w-5 h-5 group-hover:text-[#0F0] group-hover:animate-pulse transition-all duration-300" />
              <span className="relative">
                {isAuthenticated ? t('header.community') : t('header.joinCommunity')}
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#0F0] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </span>
            </a>
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
