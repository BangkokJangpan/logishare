import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, Package, MapPin, BarChart3, Users, Shield, Clock, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';

const Index = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: Truck,
      title: t('features.smartMatching.title'),
      description: t('features.smartMatching.description')
    },
    {
      icon: Package,
      title: t('features.loadManagement.title'),
      description: t('features.loadManagement.description')
    },
    {
      icon: MapPin,
      title: t('features.realTimeTracking.title'),
      description: t('features.realTimeTracking.description')
    },
    {
      icon: BarChart3,
      title: t('features.dataInsights.title'),
      description: t('features.dataInsights.description')
    },
    {
      icon: Users,
      title: t('features.userCentric.title'),
      description: t('features.userCentric.description')
    },
    {
      icon: Shield,
      title: t('features.secureTrans.title'),
      description: t('features.secureTrans.description')
    }
  ];

  const stats = [
    { label: t('stats.emptyTrip'), value: "35%", color: "text-green-400" },
    { label: t('stats.costSavings'), value: "28%", color: "text-blue-400" },
    { label: t('stats.routeEfficiency'), value: "42%", color: "text-orange-400" },
    { label: t('stats.userSatisfaction'), value: "4.8★", color: "text-yellow-400" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900">
      {/* Header */}
      <header className="bg-gray-800 shadow-sm border-b border-gray-700">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-logistics-primary rounded-lg flex items-center justify-center">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">LogiShare</h1>
            </div>
            <div className="flex items-center gap-6">
              <nav className="hidden md:flex items-center gap-6">
                <a href="#features" className="text-gray-300 hover:text-logistics-primary transition-colors">{t('nav.features')}</a>
                <a href="#how-it-works" className="text-gray-300 hover:text-logistics-primary transition-colors">{t('nav.howItWorks')}</a>
                <a href="#contact" className="text-gray-300 hover:text-logistics-primary transition-colors">{t('nav.contact')}</a>
              </nav>
              <LanguageSelector />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-white mb-6 animate-fade-in">
            {t('hero.title.smart')}
            <span className="text-logistics-primary"> {t('hero.title.sustainable')}</span>
          </h2>
          <p className="text-xl text-gray-300 mb-12 animate-slide-up">
            {t('hero.subtitle')}
          </p>
          
          {/* User Type Selection */}
          <div className="grid md:grid-cols-3 gap-6 mb-12 animate-slide-up">
            <Link to="/driver" className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 hover:shadow-xl hover:scale-105 transition-all duration-200">
              <div className="text-center">
                <div className="w-16 h-16 bg-logistics-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{t('portal.driver.title')}</h3>
                <p className="text-gray-400 mb-4">{t('portal.driver.description')}</p>
                <Button className="bg-logistics-primary hover:bg-blue-800 text-white font-medium px-6 py-3 rounded-lg w-full">
                  {t('portal.driver.button')}
                </Button>
              </div>
            </Link>

            <Link to="/shipper" className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 hover:shadow-xl hover:scale-105 transition-all duration-200">
              <div className="text-center">
                <div className="w-16 h-16 bg-logistics-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{t('portal.shipper.title')}</h3>
                <p className="text-gray-400 mb-4">{t('portal.shipper.description')}</p>
                <Button className="bg-logistics-secondary hover:bg-green-700 text-white font-medium px-6 py-3 rounded-lg w-full">
                  {t('portal.shipper.button')}
                </Button>
              </div>
            </Link>

            <Link to="/admin" className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 hover:shadow-xl hover:scale-105 transition-all duration-200">
              <div className="text-center">
                <div className="w-16 h-16 bg-logistics-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{t('portal.admin.title')}</h3>
                <p className="text-gray-400 mb-4">{t('portal.admin.description')}</p>
                <Button className="bg-logistics-accent hover:bg-orange-700 text-white font-medium px-6 py-3 rounded-lg w-full">
                  {t('portal.admin.button')}
                </Button>
              </div>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`text-3xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gray-800 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-white mb-4">{t('features.title')}</h3>
            <p className="text-gray-300 max-w-2xl mx-auto">
              {t('features.subtitle')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-gray-700 border-gray-600 shadow-lg hover:shadow-xl transition-shadow duration-200">
                <CardHeader>
                  <div className="w-12 h-12 bg-logistics-primary/20 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-logistics-primary" />
                  </div>
                  <CardTitle className="text-xl text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-white mb-4">{t('howItWorks.title')}</h3>
            <p className="text-gray-300 max-w-2xl mx-auto">
              {t('howItWorks.subtitle')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "1", title: t('howItWorks.step1.title'), description: t('howItWorks.step1.description') },
              { step: "2", title: t('howItWorks.step2.title'), description: t('howItWorks.step2.description') },
              { step: "3", title: t('howItWorks.step3.title'), description: t('howItWorks.step3.description') },
              { step: "4", title: t('howItWorks.step4.title'), description: t('howItWorks.step4.description') }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-logistics-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                  {item.step}
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">{item.title}</h4>
                <p className="text-gray-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 border-t border-gray-700">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-logistics-primary rounded-lg flex items-center justify-center">
                  <Truck className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-xl font-bold">LogiShare</h4>
              </div>
              <p className="text-gray-400">
                {t('footer.description')}
              </p>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">{t('footer.platform')}</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/driver" className="hover:text-white transition-colors">{t('portal.driver.title')}</a></li>
                <li><a href="/shipper" className="hover:text-white transition-colors">{t('portal.shipper.title')}</a></li>
                <li><a href="/admin" className="hover:text-white transition-colors">{t('portal.admin.title')}</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">{t('footer.features')}</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">{t('features.smartMatching.title')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('features.realTimeTracking.title')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('features.dataInsights.title')}</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">{t('footer.contact')}</h5>
              <ul className="space-y-2 text-gray-400">
                <li>support@logishare.com</li>
                <li>+1 (555) 123-4567</li>
                <li>{t('footer.support')}</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>{t('footer.copyright')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
