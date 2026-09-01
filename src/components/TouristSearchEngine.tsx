// Componente de Motor de Búsqueda para Turistas Extranjeros
// Interfaz visual que proporciona perspectiva amplia de las necesidades de búsqueda
// USANDO DATOS REALES DEL PROYECTO

import { useState, useEffect } from 'react'
import { 
  Search, 
  Globe, 
  MapPin, 
  Shield, 
  Utensils, 
  Compass, 
  ShoppingBag, 
  Info, 
  ChevronRight, 
  ChevronDown, 
  Lightbulb, 
  AlertTriangle, 
  Heart, 
  Clock, 
  Users, 
  X,
  Filter,
  Languages,
  DollarSign,
  Calendar,
  Sparkles
} from 'lucide-react'
import foreignTouristSearchEngine, { 
  ComprehensiveSearchResult, 
  SearchContext,
  ProactiveRecommendation,
  SafetyInfo,
  CulturalInfo 
} from '../services/foreignTouristSearchEngine'

interface TouristSearchEngineProps {
  onClose?: () => void
  initialContext?: Partial<SearchContext>
}

const TouristSearchEngine: React.FC<TouristSearchEngineProps> = ({ onClose, initialContext }) => {
  const [query, setQuery] = useState('')
  const [searchResult, setSearchResult] = useState<ComprehensiveSearchResult | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [userContext, setUserContext] = useState<SearchContext>({
    language: 'en',
    tripStage: 'planning',
    travelStyle: 'adventure',
    budget: 'mid_range',
    ...initialContext
  })
  const [activeTab, setActiveTab] = useState<'suggestions' | 'recommendations' | 'safety' | 'cultural' | 'alternatives'>('suggestions')

  const handleSearch = () => {
    if (query.trim().length < 2) return

    setIsSearching(true)
    
    // Usar motor de búsqueda con datos reales del proyecto
    const result = foreignTouristSearchEngine.processSearch(query, userContext)
    setSearchResult(result)
    setIsSearching(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const updateContext = (key: keyof SearchContext, value: any) => {
    setUserContext(prev => ({ ...prev, [key]: value }))
  }

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'suggestions': return <Search size={20} />
      case 'recommendations': return <Lightbulb size={20} />
      case 'safety': return <Shield size={20} />
      case 'cultural': return <Heart size={20} />
      case 'alternatives': return <Compass size={20} />
      default: return <Info size={20} />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'low': return 'text-green-600 bg-green-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <div className="tourist-search-engine">
      <div className="search-header">
        <div className="search-title">
          <Globe className="text-blue-600" size={28} />
          <div>
            <h2>Tourist Search Engine</h2>
            <p>Comprehensive search perspective for international travelers</p>
          </div>
        </div>
        <button className="close-button" onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      {/* Context Configuration */}
      <div className="context-config">
        <button 
          className="context-toggle"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
        >
          <Filter size={16} />
          {showAdvancedFilters ? 'Hide Filters' : 'Show Filters'}
          <ChevronDown size={16} className={`ml-2 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
        </button>

        {showAdvancedFilters && (
          <div className="advanced-filters">
            <div className="filter-section">
              <label className="filter-label">
                <Languages size={16} />
                Language
              </label>
              <select 
                value={userContext.language}
                onChange={(e) => updateContext('language', e.target.value)}
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="de">Deutsch</option>
                <option value="fr">Français</option>
                <option value="it">Italiano</option>
                <option value="pt">Português</option>
              </select>
            </div>

            <div className="filter-section">
              <label className="filter-label">
                <Calendar size={16} />
                Trip Stage
              </label>
              <select 
                value={userContext.tripStage}
                onChange={(e) => updateContext('tripStage', e.target.value)}
              >
                <option value="planning">Planning Trip</option>
                <option value="booking">Booking Services</option>
                <option value="during_trip">During Trip</option>
                <option value="post_trip">Post Trip</option>
              </select>
            </div>

            <div className="filter-section">
              <label className="filter-label">
                <Sparkles size={16} />
                Travel Style
              </label>
              <select 
                value={userContext.travelStyle}
                onChange={(e) => updateContext('travelStyle', e.target.value)}
              >
                <option value="adventure">Adventure</option>
                <option value="cultural">Cultural</option>
                <option value="relaxation">Relaxation</option>
                <option value="family">Family</option>
                <option value="romantic">Romantic</option>
                <option value="solo">Solo Travel</option>
                <option value="group">Group Travel</option>
              </select>
            </div>

            <div className="filter-section">
              <label className="filter-label">
                <DollarSign size={16} />
                Budget
              </label>
              <select 
                value={userContext.budget}
                onChange={(e) => updateContext('budget', e.target.value)}
              >
                <option value="budget">Budget</option>
                <option value="mid_range">Mid-Range</option>
                <option value="luxury">Luxury</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Search Input */}
      <div className="search-input-container">
        <Search className="search-icon" size={20} />
        <input
          type="text"
          className="search-input"
          placeholder="What are you looking for in Salento? (e.g., 'best hotels', 'safe activities', 'local food')"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button 
          className="search-button"
          onClick={handleSearch}
          disabled={isSearching || query.trim().length < 2}
        >
          {isSearching ? 'Searching...' : 'Search'}
        </button>
      </div>

      {/* Search Results */}
      {searchResult && (
        <div className="search-results">
          {/* Detected Intent */}
          <div className="intent-banner">
            <div className="intent-info">
              <span className="intent-label">Detected Intent:</span>
              <span className="intent-value">
                {searchResult.detectedIntent.primary.charAt(0).toUpperCase() + searchResult.detectedIntent.primary.slice(1)}
              </span>
              <span className="intent-urgency">
                {searchResult.detectedIntent.urgency === 'immediate' && <AlertTriangle size={14} className="text-red-600" />}
                {searchResult.detectedIntent.urgency.charAt(0).toUpperCase() + searchResult.detectedIntent.urgency.slice(1)}
              </span>
            </div>
            <div className="expanded-queries">
              <span className="expanded-label">Also searching for:</span>
              <div className="query-chips">
                {searchResult.expandedQueries.slice(0, 3).map((q, i) => (
                  <span key={i} className="query-chip">{q}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="result-tabs">
            <button 
              className={`tab-button ${activeTab === 'suggestions' ? 'active' : ''}`}
              onClick={() => setActiveTab('suggestions')}
            >
              <Search size={16} />
              Suggestions
              {searchResult.contextualSuggestions.length > 0 && (
                <span className="tab-badge">{searchResult.contextualSuggestions.length}</span>
              )}
            </button>
            <button 
              className={`tab-button ${activeTab === 'recommendations' ? 'active' : ''}`}
              onClick={() => setActiveTab('recommendations')}
            >
              <Lightbulb size={16} />
              Recommendations
              {searchResult.proactiveRecommendations.length > 0 && (
                <span className="tab-badge">{searchResult.proactiveRecommendations.length}</span>
              )}
            </button>
            {searchResult.safetyConsiderations && (
              <button 
                className={`tab-button ${activeTab === 'safety' ? 'active' : ''}`}
                onClick={() => setActiveTab('safety')}
              >
                <Shield size={16} />
                Safety
              </button>
            )}
            {searchResult.culturalInsights && (
              <button 
                className={`tab-button ${activeTab === 'cultural' ? 'active' : ''}`}
                onClick={() => setActiveTab('cultural')}
              >
                <Heart size={16} />
                Cultural
              </button>
            )}
            <button 
              className={`tab-button ${activeTab === 'alternatives' ? 'active' : ''}`}
              onClick={() => setActiveTab('alternatives')}
            >
              <Compass size={16} />
              Alternatives
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 'suggestions' && (
              <div className="suggestions-content">
                {searchResult.contextualSuggestions.map((suggestion, index) => (
                  <div key={index} className="suggestion-card">
                    <div className="suggestion-header">
                      <div className="suggestion-type">
                        {suggestion.type === 'place' && <MapPin size={16} className="text-blue-600" />}
                        {suggestion.type === 'activity' && <Compass size={16} className="text-green-600" />}
                        {suggestion.type === 'information' && <Info size={16} className="text-purple-600" />}
                        {suggestion.type === 'planning' && <Calendar size={16} className="text-orange-600" />}
                        {suggestion.type === 'safety' && <Shield size={16} className="text-red-600" />}
                      </div>
                      <span className={`priority-badge ${getPriorityColor(suggestion.priority)}`}>
                        {suggestion.priority.toUpperCase()}
                      </span>
                    </div>
                    <h3 className="suggestion-title">{suggestion.title}</h3>
                    <p className="suggestion-description">{suggestion.description}</p>
                    {suggestion.action && (
                      <div className="suggestion-action">
                        <ChevronRight size={16} />
                        {suggestion.action}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'recommendations' && (
              <div className="recommendations-content">
                {searchResult.proactiveRecommendations.map((rec, index) => (
                  <div key={index} className="recommendation-card">
                    <div className="recommendation-header">
                      <div className="recommendation-category">
                        <Lightbulb size={16} className="text-yellow-600" />
                        <span>{rec.category}</span>
                      </div>
                      <span className="recommendation-priority">Priority: {rec.priority}</span>
                    </div>
                    <p className="recommendation-text">{rec.recommendation}</p>
                    <div className="recommendation-reasoning">
                      <span className="reasoning-label">Why:</span>
                      <span className="reasoning-text">{rec.reasoning}</span>
                    </div>
                    {rec.timing && (
                      <div className="recommendation-timing">
                        <Clock size={14} />
                        <span>{rec.timing}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'safety' && searchResult.safetyConsiderations && (
              <div className="safety-content">
                <div className="safety-overview">
                  <div className="safety-status">
                    <Shield size={24} className={searchResult.safetyConsiderations.overallSafety === 'safe' ? 'text-green-600' : 'text-yellow-600'} />
                    <div>
                      <h3>Safety Status</h3>
                      <span className={`status-badge ${searchResult.safetyConsiderations.overallSafety === 'safe' ? 'safe' : 'caution'}`}>
                        {searchResult.safetyConsiderations.overallSafety.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                {searchResult.safetyConsiderations.specificConcerns && searchResult.safetyConsiderations.specificConcerns.length > 0 && (
                  <div className="safety-concerns">
                    <h4>Considerations</h4>
                    <ul>
                      {searchResult.safetyConsiderations.specificConcerns.map((concern, index) => (
                        <li key={index}>{concern}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="emergency-contacts">
                  <h4>Emergency Contacts</h4>
                  <div className="contacts-list">
                    {searchResult.safetyConsiderations.emergencyContacts.map((contact, index) => (
                      <div key={index} className="contact-item">
                        <Phone size={16} className="text-red-600" />
                        <span>{contact}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="official-sources">
                  <h4>Official Sources</h4>
                  <ul>
                    {searchResult.safetyConsiderations.officialSources.map((source, index) => (
                      <li key={index}>{source}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'cultural' && searchResult.culturalInsights && (
              <div className="cultural-content">
                <div className="cultural-section">
                  <h4><Heart size={18} className="text-pink-600" /> Local Customs</h4>
                  <ul>
                    {searchResult.culturalInsights.localCustoms.map((custom, index) => (
                      <li key={index}>{custom}</li>
                    ))}
                  </ul>
                </div>

                <div className="cultural-section">
                  <h4><Users size={18} className="text-blue-600" /> Etiquette Tips</h4>
                  <ul>
                    {searchResult.culturalInsights.etiquette.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </div>

                <div className="cultural-section">
                  <h4><Sparkles size={18} className="text-yellow-600" /> Cultural Tips</h4>
                  <ul>
                    {searchResult.culturalInsights.tips.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </div>

                <div className="cultural-section">
                  <h4><AlertTriangle size={18} className="text-orange-600" /> Sensitive Topics</h4>
                  <ul>
                    {searchResult.culturalInsights.sensitiveTopics.map((topic, index) => (
                      <li key={index} className="text-red-600">{topic}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'alternatives' && (
              <div className="alternatives-content">
                <div className="alternatives-section">
                  <h4><Compass size={18} className="text-green-600" /> Similar Destinations</h4>
                  <div className="alternatives-list">
                    {searchResult.alternativeOptions.similarDestinations.map((dest, index) => (
                      <div key={index} className="alternative-item">
                        <MapPin size={16} />
                        <span>{dest}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="alternatives-section">
                  <h4><DollarSign size={18} className="text-blue-600" /> Different Budget Options</h4>
                  <div className="alternatives-list">
                    {searchResult.alternativeOptions.differentBudget.map((option, index) => (
                      <div key={index} className="alternative-item">
                        <DollarSign size={16} />
                        <span>{option}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="alternatives-section">
                  <h4><Sparkles size={18} className="text-purple-600" /> Different Travel Styles</h4>
                  <div className="alternatives-list">
                    {searchResult.alternativeOptions.differentStyle.map((style, index) => (
                      <div key={index} className="alternative-item">
                        <Sparkles size={16} />
                        <span>{style}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="alternatives-section">
                  <h4><Clock size={18} className="text-orange-600" /> Different Timing</h4>
                  <div className="alternatives-list">
                    {searchResult.alternativeOptions.differentTiming.map((timing, index) => (
                      <div key={index} className="alternative-item">
                        <Clock size={16} />
                        <span>{timing}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Search Tips */}
      {!searchResult && (
        <div className="search-tips">
          <h3><Lightbulb size={20} className="text-yellow-600" /> Search Tips</h3>
          <div className="tips-grid">
            <div className="tip-card">
              <h4>Accommodation</h4>
              <p>Try: "best hotels", "budget hostels", "rural vs town stay"</p>
            </div>
            <div className="tip-card">
              <h4>Food & Dining</h4>
              <p>Try: "local restaurants", "trout dishes", "coffee shops"</p>
            </div>
            <div className="tip-card">
              <h4>Activities</h4>
              <p>Try: "things to do", "coffee tours", "hiking trails"</p>
            </div>
            <div className="tip-card">
              <h4>Safety</h4>
              <p>Try: "is it safe", "emergency contacts", "travel safety"</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TouristSearchEngine