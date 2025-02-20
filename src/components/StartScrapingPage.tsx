import React, { useState } from 'react';
import { Search, Users, UserPlus, Shield, User, Mail, Key, Eye, EyeOff, Loader, ArrowRight, Hash, Terminal, Zap, Database, AlertCircle, CreditCard, Check, Lock, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import GlitchText from './GlitchText';
import LegalNotices from './LegalNotices';
import { useAuth, AuthenticationError } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import { useTranslation } from 'react-i18next';
import NavigationButtons from './NavigationButtons';

interface ExtractionConfig {
  isHashtagMode: boolean;
  profileUrl: string;
  hashtag: string;
  extractFollowers: boolean;
  extractFollowing: boolean;
  creditsToUse: number;
}

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast Extraction',
    description: 'Extract thousands of profiles in minutes with our optimized algorithms.',
    color: 'text-yellow-400'
  },
  {
    icon: Shield,
    title: 'Military-Grade Security',
    description: 'Advanced encryption protocols protect your data and maintain anonymity during extraction.',
    color: 'text-emerald-400'
  },
  {
    icon: Database,
    title: 'Ghost Mode Scraping',
    description: 'Undetectable extraction methods ensure your activities remain completely private.',
    color: 'text-purple-400'
  }
];

const StartScrapingPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, isVerified, signUp, signIn, setVerificationEmail } = useAuth();
  const { credits, hasUsedFreeCredits } = useUser();
  const [authState, setAuthState] = useState<'login' | 'register'>('register');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [extractionConfig, setExtractionConfig] = useState<ExtractionConfig>({
    isHashtagMode: false,
    profileUrl: '',
    hashtag: '',
    extractFollowers: true,
    extractFollowing: false,
    creditsToUse: hasUsedFreeCredits ? 500 : 1
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (authState === 'register') {
        await signUp(email, password, firstName, lastName);
        // After successful signup, user needs to verify email
        navigate('/verify-email');
      } else {
        await signIn(email, password);
        if (!isVerified) {
          navigate('/verify-email');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error: any) {
      if (error instanceof AuthenticationError) {
        setError(error.message);
        if (error.code === 'user_already_exists') {
          setAuthState('login');
          setPassword('');
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-20 px-4 mt-16">
      <div className="max-w-7xl mx-auto">
        {/* Navigation */}
        <div className="mb-8">
          <NavigationButtons />
        </div>

        {/* Header */}
        <div className="text-center mb-16 relative">
          <div className="absolute inset-0 bg-[#0F0]/20 blur-[100px] rounded-full animate-pulse" />
          <div className="relative">
            <GlitchText 
              text={isAuthenticated ? "Start Extraction" : "Join the Network"}
              className="text-4xl md:text-5xl font-bold mb-4"
            />
            <p className="text-gray-400 text-xl max-w-2xl mx-auto">
              {isAuthenticated 
                ? "Configure your extraction settings and start gathering data"
                : "Create your account to start extracting data with military-grade security"}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left Column - Auth Form or Extraction Form */}
          <div className="relative">
            <div className="absolute inset-0 bg-[#0F0]/20 blur-[100px] rounded-full animate-pulse" />
            
            <div className="relative bg-black/40 backdrop-blur-sm border border-[#0F0]/20 rounded-xl p-8">
              {!isAuthenticated ? (
                <>
                  <div className="text-center mb-8">
                    <Terminal className="w-16 h-16 text-[#0F0] mx-auto mb-4 animate-[float_4s_ease-in-out_infinite]" />
                    <h3 className="text-2xl font-bold text-[#0F0] mb-2">
                      {authState === 'login' ? 'Welcome Back' : 'Create Account'}
                    </h3>
                    <p className="text-gray-400">
                      {authState === 'login' 
                        ? 'Sign in to start extracting data'
                        : 'Register to access advanced extraction features'}
                    </p>
                  </div>

                  <form className="space-y-6" onSubmit={handleSubmit}>
                    {error && (
                      <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        {error}
                      </div>
                    )}

                    {authState === 'register' && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="firstName" className="sr-only">First Name</label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                              id="firstName"
                              name="firstName"
                              type="text"
                              required
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              className="w-full bg-black/50 border border-[#0F0]/30 rounded-lg py-3 px-10 text-white placeholder-gray-500 focus:border-[#0F0] focus:ring-1 focus:ring-[#0F0] transition-all"
                              placeholder="First Name"
                            />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="lastName" className="sr-only">Last Name</label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                              id="lastName"
                              name="lastName"
                              type="text"
                              required
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                              className="w-full bg-black/50 border border-[#0F0]/30 rounded-lg py-3 px-10 text-white placeholder-gray-500 focus:border-[#0F0] focus:ring-1 focus:ring-[#0F0] transition-all"
                              placeholder="Last Name"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <div>
                      <label htmlFor="email" className="sr-only">Email address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-black/50 border border-[#0F0]/30 rounded-lg py-3 px-10 text-white placeholder-gray-500 focus:border-[#0F0] focus:ring-1 focus:ring-[#0F0] transition-all"
                          placeholder="Email address"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="password" className="sr-only">Password</label>
                      <div className="relative">
                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          id="password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-black/50 border border-[#0F0]/30 rounded-lg py-3 px-10 text-white placeholder-gray-500 focus:border-[#0F0] focus:ring-1 focus:ring-[#0F0] transition-all"
                          placeholder="Password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0F0] transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    {authState === 'register' && (
                      <LegalNotices 
                        type="extraction"
                        checked={agreedToTerms}
                        onChange={setAgreedToTerms}
                      />
                    )}

                    <Button
                      type="submit"
                      className="w-full group"
                      disabled={loading || (authState === 'register' && (!agreedToTerms || !firstName || !lastName))}
                    >
                      {loading ? (
                        <Loader className="h-5 w-5 animate-spin" />
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          {authState === 'login' ? 'Sign in' : 'Create account'}
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      )}
                    </Button>

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => {
                          setAuthState(authState === 'login' ? 'register' : 'login');
                          setFirstName('');
                          setLastName('');
                          setError('');
                        }}
                        className="text-[#0F0]/70 hover:text-[#0F0] transition-colors"
                      >
                        {authState === 'login' 
                          ? "Don't have an account? Sign up"
                          : 'Already have an account? Sign in'}
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Extraction Mode</label>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          onClick={() => setExtractionConfig(prev => ({ ...prev, isHashtagMode: false }))}
                          className={`flex items-center gap-2 p-3 rounded-lg border transition-all ${
                            !extractionConfig.isHashtagMode
                              ? 'border-[#0F0] bg-[#0F0]/10'
                              : 'border-gray-700 hover:border-[#0F0]/50'
                          }`}
                        >
                          <Users className="w-4 h-4" />
                          <span>Profile</span>
                        </button>
                        <button
                          onClick={() => setExtractionConfig(prev => ({ ...prev, isHashtagMode: true }))}
                          className={`flex items-center gap-2 p-3 rounded-lg border transition-all ${
                            extractionConfig.isHashtagMode
                              ? 'border-[#0F0] bg-[#0F0]/10'
                              : 'border-gray-700 hover:border-[#0F0]/50'
                          }`}
                        >
                          <Hash className="w-4 h-4" />
                          <span>Hashtag</span>
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        {extractionConfig.isHashtagMode ? 'Hashtag' : 'Profile URL'}
                      </label>
                      <input
                        type="text"
                        value={extractionConfig.isHashtagMode ? extractionConfig.hashtag : extractionConfig.profileUrl}
                        onChange={(e) => setExtractionConfig(prev => ({
                          ...prev,
                          [extractionConfig.isHashtagMode ? 'hashtag' : 'profileUrl']: e.target.value
                        }))}
                        className="w-full bg-black/50 border border-[#0F0]/30 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:border-[#0F0] focus:ring-1 focus:ring-[#0F0] transition-all"
                        placeholder={extractionConfig.isHashtagMode ? "Enter hashtag without #" : "Enter Instagram profile URL"}
                      />
                    </div>

                    {!extractionConfig.isHashtagMode && (
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Data to Extract</label>
                        <div className="grid grid-cols-2 gap-4">
                          <label className="flex items-center gap-2 p-3 rounded-lg border border-gray-700 hover:border-[#0F0]/50 transition-all cursor-pointer">
                            <input
                              type="checkbox"
                              checked={extractionConfig.extractFollowers}
                              onChange={(e) => setExtractionConfig(prev => ({ ...prev, extractFollowers: e.target.checked }))}
                              className="w-4 h-4 border-2 border-[#0F0]/50 rounded bg-black text-[#0F0] focus:ring-[#0F0] focus:ring-offset-0"
                            />
                            <span>Followers</span>
                          </label>
                          <label className="flex items-center gap-2 p-3 rounded-lg border border-gray-700 hover:border-[#0F0]/50 transition-all cursor-pointer">
                            <input
                              type="checkbox"
                              checked={extractionConfig.extractFollowing}
                              onChange={(e) => setExtractionConfig(prev => ({ ...prev, extractFollowing: e.target.checked }))}
                              className="w-4 h-4 border-2 border-[#0F0]/50 rounded bg-black text-[#0F0] focus:ring-[#0F0] focus:ring-offset-0"
                            />
                            <span>Following</span>
                          </label>
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Credits to Use</label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="number"
                          value={extractionConfig.creditsToUse}
                          onChange={(e) => setExtractionConfig(prev => ({ ...prev, creditsToUse: parseInt(e.target.value) || 0 }))}
                          min={hasUsedFreeCredits ? 500 : 1}
                          className="w-full bg-black/50 border border-[#0F0]/30 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:border-[#0F0] focus:ring-1 focus:ring-[#0F0] transition-all"
                        />
                      </div>
                      <div className="text-sm text-gray-400 mt-2">
                        {hasUsedFreeCredits ? (
                          <>Minimum 500 credits required</>
                        ) : (
                          <>First extraction: Use as little as 1 credit!</>
                        )}
                      </div>
                    </div>

                    <Button className="w-full">
                      START_EXTRACTION.exe
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Column - Features */}
          <div className="space-y-8">
            <div className="bg-black/40 backdrop-blur-sm border border-[#0F0]/20 rounded-xl p-8">
              <h3 className="text-xl font-bold text-[#0F0] mb-6">Extraction Features</h3>
              <div className="space-y-6">
                {features.map((feature, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-4 p-4 border border-[#0F0]/20 rounded-lg hover:border-[#0F0]/50 transition-all group"
                  >
                    <feature.icon className={`w-8 h-8 ${feature.color} transform group-hover:scale-110 transition-transform`} />
                    <div>
                      <h4 className="font-semibold mb-1">{feature.title}</h4>
                      <p className="text-gray-400 text-sm">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-black/40 backdrop-blur-sm border border-[#0F0]/20 rounded-xl p-8">
              <h3 className="text-xl font-bold text-[#0F0] mb-6">Security Features</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-[#0F0]" />
                  <span>Ghost mode extraction for undetectable operation</span>
                </div>
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-[#0F0]" />
                  <span>Military-grade encryption (AES-256)</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-[#0F0]" />
                  <span>Automatic IP rotation across global proxy network</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-[#0F0]" />
                  <span>Smart rate limiting to prevent detection</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartScrapingPage;
