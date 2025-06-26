import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Users, 
  Truck, 
  Package, 
  DollarSign, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const AdminPage = () => {
  const { t } = useLanguage();
  const platformStats = [
    { label: t('admin.stats.activeDrivers'), value: "1,247", icon: Truck, color: "text-blue-600", change: "+12%" },
    { label: t('admin.stats.activeShippers'), value: "843", icon: Users, color: "text-green-600", change: "+8%" },
    { label: t('admin.stats.dailyShipments'), value: "456", icon: Package, color: "text-purple-600", change: "+15%" },
    { label: t('admin.stats.platformRevenue'), value: "$52,340", icon: DollarSign, color: "text-orange-600", change: "+23%" }
  ];

  const recentTransactions = [
    { id: "TXN-001", type: t('admin.driverPayment'), amount: "$1,250", status: t('admin.completed'), time: "2 hours ago" },
    { id: "TXN-002", type: t('admin.shipperCharge'), amount: "$1,450", status: t('admin.completed'), time: "3 hours ago" },
    { id: "TXN-003", type: t('admin.platformFee'), amount: "$145", status: t('admin.pending'), time: "5 hours ago" },
    { id: "TXN-004", type: t('admin.driverPayment'), amount: "$980", status: t('admin.completed'), time: "6 hours ago" }
  ];

  const systemAlerts = [
    { type: "warning", message: "High demand in Phoenix-Denver route", time: "1 hour ago" },
    { type: "info", message: "New driver verification pending", time: "2 hours ago" },
    { type: "success", message: "System maintenance completed", time: "3 hours ago" },
    { type: "error", message: "Payment gateway timeout resolved", time: "4 hours ago" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 p-6 text-foreground">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">{t('admin.dashboard.title')}</h1>
          <p className="text-gray-300 mt-1">{t('admin.dashboard.overview')}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {platformStats.map((stat, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700 rounded-xl shadow-lg p-6">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-300 mb-1">{t(stat.label)}</p>
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

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Charts & Analytics */}
          <div className="lg:col-span-2 space-y-6">
            {/* Revenue Chart */}
            <Card className="bg-gray-800 border-gray-700 rounded-xl shadow-lg p-6">
              <CardHeader>
                <CardTitle className="text-xl text-white">{t('admin.revenueAnalytics.title')}</CardTitle>
                <CardDescription>{t('admin.revenueAnalytics.description')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gradient-to-br from-logistics-primary/10 to-logistics-secondary/10 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 text-logistics-primary mx-auto mb-4" />
                    <p className="text-lg font-semibold text-white">{t('admin.revenueAnalytics.chartTitle')}</p>
                    <p className="text-gray-300">{t('admin.revenueAnalytics.chartDescription')}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-logistics-primary">$156K</div>
                    <div className="text-sm text-gray-300">{t('admin.revenueAnalytics.thisMonth')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-logistics-secondary">$142K</div>
                    <div className="text-sm text-gray-300">{t('admin.revenueAnalytics.lastMonth')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-logistics-accent">+9.8%</div>
                    <div className="text-sm text-gray-300">{t('admin.revenueAnalytics.growth')}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card className="bg-gray-800 border-gray-700 rounded-xl shadow-lg p-6">
              <CardHeader>
                <CardTitle className="text-xl text-white">{t('admin.recentTransactions.title')}</CardTitle>
                <CardDescription>{t('admin.recentTransactions.description')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTransactions.map((transaction, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-logistics-primary/10 rounded-lg flex items-center justify-center">
                          <DollarSign className="w-5 h-5 text-logistics-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{t(transaction.type)}</p>
                          <p className="text-sm text-gray-300">{t('admin.recentTransactions.id')}: {transaction.id}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-white">{transaction.amount}</p>
                        <div className="flex items-center gap-2">
                          <Badge className={
                            transaction.status === 'completed' ? 'status-active' : 'status-pending'
                          }>
                            {t(transaction.status)}
                          </Badge>
                          <span className="text-xs text-gray-500">{transaction.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Route Performance */}
            <Card className="bg-gray-800 border-gray-700 rounded-xl shadow-lg p-6">
              <CardHeader>
                <CardTitle className="text-xl text-white">{t('admin.topPerformingRoutes.title')}</CardTitle>
                <CardDescription>{t('admin.topPerformingRoutes.description')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { route: "Los Angeles → Phoenix", shipments: 142, revenue: "$18,450", efficiency: "94%" },
                    { route: "Phoenix → Denver", shipments: 98, revenue: "$15,230", efficiency: "91%" },
                    { route: "Denver → Chicago", shipments: 76, revenue: "$12,800", efficiency: "88%" },
                    { route: "Chicago → Atlanta", shipments: 64, revenue: "$10,950", efficiency: "86%" }
                  ].map((route, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-gray-700 rounded-lg">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-logistics-secondary" />
                        <div>
                          <p className="font-medium text-white">{route.route}</p>
                          <p className="text-sm text-gray-300">{route.shipments} {t('admin.topPerformingRoutes.shipments')}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-white">{route.revenue}</p>
                        <p className="text-sm text-gray-300">{route.efficiency} {t('admin.topPerformingRoutes.efficiency')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - System Status & Alerts */}
          <div className="space-y-6">
            {/* System Status */}
            <Card className="bg-gray-800 border-gray-700 rounded-xl shadow-lg p-6">
              <CardHeader>
                <CardTitle className="text-lg text-white">{t('admin.systemStatus.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">{t('admin.systemStatus.apiStatus')}</span>
                    <Badge className="status-active">{t('admin.operational')}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">{t('admin.systemStatus.database')}</span>
                    <Badge className="status-active">{t('admin.healthy')}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">{t('admin.systemStatus.paymentGateway')}</span>
                    <Badge className="status-active">{t('admin.connected')}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">{t('admin.systemStatus.gpsTracking')}</span>
                    <Badge className="status-pending">{t('admin.maintenance')}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">{t('admin.systemStatus.mobileApps')}</span>
                    <Badge className="status-active">{t('admin.online')}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Alerts */}
            <Card className="bg-gray-800 border-gray-700 rounded-xl shadow-lg p-6">
              <CardHeader>
                <CardTitle className="text-lg text-white">{t('admin.systemAlerts.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {systemAlerts.map((alert, index) => (
                    <div key={index} className={`flex items-start gap-3 p-3 rounded-lg ${
                      alert.type === 'warning' ? 'bg-yellow-50' :
                      alert.type === 'error' ? 'bg-red-50' :
                      alert.type === 'success' ? 'bg-green-50' : 'bg-blue-50'
                    }`}>
                      {alert.type === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />}
                      {alert.type === 'error' && <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />}
                      {alert.type === 'success' && <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />}
                      {alert.type === 'info' && <Clock className="w-5 h-5 text-blue-500 mt-0.5" />}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">{t(alert.message)}</p>
                        <p className="text-xs text-gray-300">{alert.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gray-800 border-gray-700 rounded-xl shadow-lg p-6">
              <CardHeader>
                <CardTitle className="text-lg text-white">{t('admin.platformManagement.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start text-white">
                    <Users className="w-4 h-4 mr-2" />
                    {t('admin.platformManagement.manageUsers')}
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-white">
                    <Truck className="w-4 h-4 mr-2" />
                    {t('admin.platformManagement.vehicleVerifications')}
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-white">
                    <DollarSign className="w-4 h-4 mr-2" />
                    {t('admin.platformManagement.paymentSettings')}
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-white">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    {t('admin.platformManagement.analyticsReports')}
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-white">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    {t('admin.platformManagement.systemMaintenance')}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card className="bg-gray-800 border-gray-700 rounded-xl shadow-lg p-6">
              <CardHeader>
                <CardTitle className="text-lg text-white">{t('admin.performanceMetrics.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-300">{t('admin.performanceMetrics.matchSuccessRate')}</span>
                      <span className="text-sm font-medium text-white">94.2%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-logistics-secondary h-2 rounded-full" style={{ width: '94.2%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-300">{t('admin.performanceMetrics.driverSatisfaction')}</span>
                      <span className="text-sm font-medium text-white">4.8/5</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-logistics-primary h-2 rounded-full" style={{ width: '96%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-300">{t('admin.performanceMetrics.platformUptime')}</span>
                      <span className="text-sm font-medium text-white">99.8%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-logistics-accent h-2 rounded-full" style={{ width: '99.8%' }}></div>
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

export default AdminPage;
