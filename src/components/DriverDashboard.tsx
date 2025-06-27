import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Truck, 
  MapPin, 
  Clock, 
  DollarSign, 
  Package, 
  Navigation, 
  Star,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { fetchUsers, fetchPosts, createUser, createPost, deleteUser, deletePost, updateUser, updatePost } from '@/lib/api';
import Logo from '@/components/ui/Logo';

// 현재 날짜/시각 구하기
const getToday = () => {
  const d = new Date();
  return d.toISOString().slice(0, 10);
};
const getNowTime = () => {
  const d = new Date();
  return d.toTimeString().slice(0, 5);
};

const DriverDashboard = () => {
  const { t } = useLanguage();
  const [activeTrip, setActiveTrip] = useState({
    id: "TRP-001",
    cargo: "Electronics Shipment",
    pickup: "Los Angeles, CA",
    delivery: "Phoenix, AZ",
    distance: "387 miles",
    estimatedEarning: "$1,250",
    status: "in-transit",
    progress: 65,
    eta: "4h 32m"
  });

  const availableLoads = [
    {
      id: "LD-001",
      cargo: "Consumer Goods",
      pickup: "Phoenix, AZ",
      delivery: "Denver, CO",
      distance: "890 miles",
      weight: "15,000 lbs",
      earning: "$1,800",
      urgent: true,
      matchScore: 95
    },
    {
      id: "LD-002",
      cargo: "Auto Parts",
      pickup: "Phoenix, AZ",
      delivery: "Las Vegas, NV",
      distance: "300 miles",
      weight: "8,500 lbs",
      earning: "$950",
      urgent: false,
      matchScore: 87
    },
    {
      id: "LD-003",
      cargo: "Food Products",
      pickup: "Tucson, AZ",
      delivery: "San Diego, CA",
      distance: "520 miles",
      weight: "12,000 lbs",
      earning: "$1,400",
      urgent: false,
      matchScore: 82
    }
  ];

  const stats = [
    { label: t('driver.stats.earnings'), value: "$3,240", icon: DollarSign, color: "text-green-600" },
    { label: t('driver.stats.completedTrips'), value: "8", icon: CheckCircle, color: "text-blue-600" },
    { label: t('driver.stats.avgRating'), value: "4.9", icon: Star, color: "text-yellow-600" },
    { label: t('driver.stats.efficiency'), value: "94%", icon: TrendingUp, color: "text-purple-600" }
  ];

  const [users, setUsers] = useState([
    { id: 1, name: '김철수' },
    { id: 2, name: '이영희' },
    { id: 3, name: '박기사' },
  ]);

  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    // fetchUsers().then(res => {
    //   if (res.success) setUsers(res.data);
    // });
    // fetchPosts().then(res => {
    //   if (res.success) setPosts(res.data);
    // });
    // 샘플 차량 데이터 추가
    setVehicles([
      { id: 2001, number: '12가3456' },
      { id: 2002, number: '34나5678' },
      { id: 2003, number: '56다7890' },
      { id: 2004, number: '78라1234' },
      { id: 2005, number: '90마5678' },
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 p-6 text-foreground">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 relative">
          <div className="flex items-center justify-between">
            {/* 좌측: 홈버튼 */}
            <div className="flex items-center gap-4 min-w-[180px]">
              <Logo />
            </div>
            {/* 중앙: 제목/부제목 */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full pointer-events-none">
              <h1 className="text-3xl font-bold text-white pointer-events-auto">{t('driver.dashboard.title')}</h1>
              <p className="text-gray-300 mt-1 pointer-events-auto">{t('driver.dashboard.welcome')}</p>
            </div>
            {/* 우측: (필요시) 버튼 등 */}
            <div className="flex items-center gap-4 min-w-[220px] justify-end">
              <Badge className="status-active">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                {t('driver.dashboard.online')}
              </Badge>
              <Button className="logistics-button-primary">
                <MapPin className="w-4 h-4 mr-2 text-complementary" />
                {t('driver.dashboard.updateLocation')}
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700 rounded-xl shadow-lg p-6">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-300 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-gray-900 ${stat.color}`}>
                    <stat.icon className="w-6 h-6 text-complementary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Current Trip & Available Loads */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Trip */}
            <Card className="bg-gray-800 border-gray-700 rounded-xl shadow-lg p-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-logistics-primary rounded-lg flex items-center justify-center">
                      <Truck className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-white">{t('driver.currentTrip')}</CardTitle>
                      <CardDescription className="text-gray-300">{t('driver.tripId')}: {activeTrip.id}</CardDescription>
                    </div>
                  </div>
                  <Badge className="status-active">{t('driver.inTransit')}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Package className="w-5 h-5 text-complementary" />
                      <span className="text-white font-medium">{activeTrip.cargo}</span>
                    </div>
                    <span className="text-logistics-primary font-semibold">{activeTrip.estimatedEarning}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-green-400" />
                      <div>
                        <p className="text-sm text-gray-300">{t('driver.pickup')}</p>
                        <p className="font-medium text-white">{activeTrip.pickup}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-red-400" />
                      <div>
                        <p className="text-sm text-gray-300">{t('driver.delivery')}</p>
                        <p className="font-medium text-white">{activeTrip.delivery}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-900 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-300">{t('driver.progress')}</span>
                      <span className="text-sm font-medium text-white">{activeTrip.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-logistics-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${activeTrip.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between mt-3 text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-complementary" />
                        <span className="text-white">{t('driver.eta')}: {activeTrip.eta}</span>
                      </div>
                      <span className="text-gray-300">{activeTrip.distance}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button className="logistics-button-primary flex-1">
                      <Navigation className="w-4 h-4 mr-2 text-complementary" />
                      {t('driver.navigate')}
                    </Button>
                    <Button variant="outline" className="flex-1">
                      {t('driver.updateStatus')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Available Loads */}
            <Card className="bg-gray-800 border-gray-700 rounded-xl shadow-lg p-6">
              <CardHeader>
                <CardTitle className="text-xl text-white">{t('driver.availableLoads')}</CardTitle>
                <CardDescription className="text-gray-300">{t('driver.smartMatches')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {availableLoads.map((load) => (
                    <div key={load.id} className="border border-gray-700 rounded-lg p-4 hover:border-logistics-primary transition-colors duration-200 bg-gray-900">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-logistics-secondary/10 rounded-lg flex items-center justify-center">
                            <Package className="w-5 h-5 text-logistics-secondary" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-white">{load.cargo}</h4>
                            <p className="text-sm text-gray-300">ID: {load.id}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-logistics-primary">{load.earning}</div>
                          {load.urgent && <Badge className="bg-red-900 text-red-300 text-xs">{t('driver.urgent')}</Badge>}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-gray-300">{t('driver.pickup')}</p>
                          <p className="text-sm font-medium text-white">{load.pickup}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-300">{t('driver.delivery')}</p>
                          <p className="text-sm font-medium text-white">{load.delivery}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-4 text-sm text-gray-300">
                          <span>{load.distance}</span>
                          <span>{load.weight}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-complementary" />
                          <span className="text-sm font-medium text-white">{load.matchScore}% {t('driver.match')}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button className="logistics-button-primary flex-1">{t('driver.acceptLoad')}</Button>
                        <Button variant="outline" size="sm" className="text-white border-gray-600">{t('driver.details')}</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Quick Actions, Vehicle Status, Notifications */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-gray-800 border-gray-700 rounded-xl shadow-lg p-6">
              <CardHeader>
                <CardTitle className="text-lg text-white">{t('driver.quickActions')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start text-white border-gray-600" onClick={() => {}}>
                    <Clock className="w-4 h-4 mr-2 text-complementary" />
                    공차 예정 정보 추가
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-white border-gray-600">
                    <MapPin className="w-4 h-4 mr-2 text-complementary" />
                    {t('driver.updatePreferredRoutes')}
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-white border-gray-600">
                    <Star className="w-4 h-4 mr-2 text-complementary" />
                    {t('driver.viewRatingReviews')}
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-white border-gray-600">
                    <DollarSign className="w-4 h-4 mr-2 text-complementary" />
                    {t('driver.earningsReport')}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Vehicle Status */}
            <Card className="bg-gray-800 border-gray-700 rounded-xl shadow-lg p-6">
              <CardHeader>
                <CardTitle className="text-lg text-white">{t('driver.vehicleStatus')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">{t('driver.vehicle')}</span>
                    <span className="font-medium text-white">2022 Freightliner</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">{t('driver.capacity')}</span>
                    <span className="font-medium text-white">80,000 lbs</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">{t('driver.currentLoad')}</span>
                    <span className="font-medium text-white">65,000 lbs</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">{t('driver.availableSpace')}</span>
                    <span className="font-medium text-logistics-secondary">15,000 lbs</span>
                  </div>
                  <div className="pt-2">
                    <Button variant="outline" className="w-full text-white border-gray-600">
                      {t('driver.updateVehicleInfo')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="bg-gray-800 border-gray-700 rounded-xl shadow-lg p-6">
              <CardHeader>
                <CardTitle className="text-lg text-white">{t('driver.notifications')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-blue-900 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-white">{t('driver.newHighPriorityLoad')}</p>
                      <p className="text-xs text-gray-300">{t('driver.premiumRateAvailable')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-green-900 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-white">{t('driver.paymentReceived')}</p>
                      <p className="text-xs text-gray-300">{t('driver.paymentForTrip')}: TRP-987</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-yellow-900 rounded-lg">
                    <Clock className="w-5 h-5 text-yellow-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-white">{t('driver.maintenanceReminder')}</p>
                      <p className="text-xs text-gray-300">{t('driver.nextServiceDue')}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
