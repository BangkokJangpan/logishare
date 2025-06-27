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
  MapPin,
  Building,
  User
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from '@/components/ui/table';
import Logo from '@/components/ui/Logo';

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

  const [userDialogOpen, setUserDialogOpen] = React.useState(false);

  const [users, setUsers] = React.useState([
    { phone: '010-1111-0001', name: '관리자A', email: 'adminA@example.com', role: 'A' },
    { phone: '010-2222-0002', name: '매니저B', email: 'managerB@example.com', role: 'B' },
    { phone: '010-3333-0003', name: '직원C', email: 'staffC@example.com', role: 'C' },
    { phone: '010-4444-0004', name: '외주D', email: 'partnerD@example.com', role: 'D' },
    { phone: '010-5555-0005', name: '게스트E', email: 'guestE@example.com', role: 'E' }
  ]);
  const [form, setForm] = React.useState({ phone: '', name: '', email: '', role: '' });
  const [editPhone, setEditPhone] = React.useState(null);

  const handleChange = e => {
    const { name, value } = e.target;
    if (name === 'phone') {
      // 숫자만 허용
      const onlyNums = value.replace(/[^0-9]/g, '');
      setForm(prev => ({ ...prev, [name]: onlyNums }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.phone || !form.name || !form.role) return;
    if (editPhone) {
      setUsers(users.map(u => u.phone === editPhone ? { ...form } : u));
      setEditPhone(null);
    } else {
      if (users.some(u => u.phone === form.phone)) return;
      setUsers([...users, { ...form }]);
    }
    setForm({ phone: '', name: '', email: '', role: '' });
  };

  const handleEdit = user => {
    setForm(user);
    setEditPhone(user.phone);
  };

  const handleDelete = phone => {
    setUsers(users.filter(u => u.phone !== phone));
    if (editPhone === phone) {
      setForm({ phone: '', name: '', email: '', role: '' });
      setEditPhone(null);
    }
  };

  const [companyDialogOpen, setCompanyDialogOpen] = React.useState(false);
  const [companies, setCompanies] = React.useState([
    { id: 1001, name: '로지쉐어', ceo: '홍길동', contact: '010-1234-1001', manager: '이수진', managerContact: '010-9000-1001' },
    { id: 1002, name: '스마트물류', ceo: '김철수', contact: '010-1234-1002', manager: '박지현', managerContact: '010-9000-1002' },
    { id: 1003, name: '에코트랜스', ceo: '이영희', contact: '010-1234-1003', manager: '최민호', managerContact: '010-9000-1003' },
    { id: 1004, name: '글로벌로지', ceo: '박민수', contact: '010-1234-1004', manager: '정유진', managerContact: '010-9000-1004' },
    { id: 1005, name: '이지카고', ceo: '최지우', contact: '010-1234-1005', manager: '한지훈', managerContact: '010-9000-1005' }
  ]);
  const [companyForm, setCompanyForm] = React.useState({ id: '', name: '', ceo: '', contact: '', manager: '', managerContact: '' });
  const [editCompanyId, setEditCompanyId] = React.useState(null);

  const handleCompanyChange = e => {
    const { name, value } = e.target;
    if (name === 'id' || name === 'managerContact') {
      // 숫자만 허용
      const onlyNums = value.replace(/[^0-9]/g, '');
      setCompanyForm(prev => ({ ...prev, [name]: onlyNums }));
    } else {
      setCompanyForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCompanySubmit = e => {
    e.preventDefault();
    if (!companyForm.id || !companyForm.name) return;
    if (editCompanyId) {
      setCompanies(companies.map(c => c.id === editCompanyId ? { ...companyForm, id: Number(companyForm.id) } : c));
      setEditCompanyId(null);
    } else {
      if (companies.some(c => c.id === Number(companyForm.id))) return;
      setCompanies([...companies, { ...companyForm, id: Number(companyForm.id) }]);
    }
    setCompanyForm({ id: '', name: '', ceo: '', contact: '', manager: '', managerContact: '' });
  };

  const handleCompanyEdit = company => {
    setCompanyForm({ ...company, id: String(company.id) });
    setEditCompanyId(company.id);
  };

  const handleCompanyDelete = id => {
    setCompanies(companies.filter(c => c.id !== id));
    if (editCompanyId === id) {
      setCompanyForm({ id: '', name: '', ceo: '', contact: '', manager: '', managerContact: '' });
      setEditCompanyId(null);
    }
  };

  const [vehicleDialogOpen, setVehicleDialogOpen] = React.useState(false);
  const [vehicles, setVehicles] = React.useState([
    { id: 2001, number: '12가3456', type: '트럭', weight: 5000, companyId: 1001, driver: '이수진', driverContact: '010-9000-2001' },
    { id: 2002, number: '34나5678', type: '탑차', weight: 3500, companyId: 1002, driver: '박지현', driverContact: '010-9000-2002' },
    { id: 2003, number: '56다7890', type: '윙바디', weight: 4500, companyId: 1003, driver: '최민호', driverContact: '010-9000-2003' },
    { id: 2004, number: '78라1234', type: '냉동탑차', weight: 4000, companyId: 1004, driver: '정유진', driverContact: '010-9000-2004' },
    { id: 2005, number: '90마5678', type: '트레일러', weight: 10000, companyId: 1005, driver: '한지훈', driverContact: '010-9000-2005' }
  ]);
  const [vehicleForm, setVehicleForm] = React.useState({ id: '', number: '', type: '', weight: '', companyId: '', driver: '', driverContact: '' });
  const [editVehicleId, setEditVehicleId] = React.useState(null);

  const handleVehicleChange = e => {
    const { name, value } = e.target;
    if (name === 'id' || name === 'weight') {
      const onlyNums = value.replace(/[^0-9]/g, '');
      setVehicleForm(prev => ({ ...prev, [name]: onlyNums }));
    } else {
      setVehicleForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleVehicleSubmit = e => {
    e.preventDefault();
    if (!vehicleForm.id || !vehicleForm.number) return;
    if (editVehicleId) {
      setVehicles(vehicles.map(v => v.id === editVehicleId ? { ...vehicleForm, id: Number(vehicleForm.id), weight: Number(vehicleForm.weight), companyId: Number(vehicleForm.companyId) } : v));
      setEditVehicleId(null);
    } else {
      if (vehicles.some(v => v.id === Number(vehicleForm.id))) return;
      setVehicles([...vehicles, { ...vehicleForm, id: Number(vehicleForm.id), weight: Number(vehicleForm.weight), companyId: Number(vehicleForm.companyId) }]);
    }
    setVehicleForm({ id: '', number: '', type: '', weight: '', companyId: '', driver: '', driverContact: '' });
  };

  const handleVehicleEdit = vehicle => {
    setVehicleForm({ ...vehicle, id: String(vehicle.id), weight: String(vehicle.weight), companyId: String(vehicle.companyId) });
    setEditVehicleId(vehicle.id);
  };

  const handleVehicleDelete = id => {
    setVehicles(vehicles.filter(v => v.id !== id));
    if (editVehicleId === id) {
      setVehicleForm({ id: '', number: '', type: '', weight: '', companyId: '', driver: '', driverContact: '' });
      setEditVehicleId(null);
    }
  };

  const [tripDialogOpen, setTripDialogOpen] = React.useState(false);
  const [trips, setTrips] = React.useState([
    { id: 1, vehicleId: 2001, driverId: 1, departure: '서울', arrival: '부산', departureTime: '2024-06-01T09:00', arrivalTime: '2024-06-01T15:00', status: '완료' },
    { id: 2, vehicleId: 2002, driverId: 2, departure: '인천', arrival: '대구', departureTime: '2024-06-02T08:00', arrivalTime: '2024-06-02T14:00', status: '진행중' },
  ]);
  const [tripForm, setTripForm] = React.useState({ id: '', vehicleId: '', driverId: '', departure: '', arrival: '', departureTime: '', arrivalTime: '', status: '' });
  const [editTripId, setEditTripId] = React.useState(null);

  const handleTripChange = e => {
    const { name, value } = e.target;
    setTripForm(prev => ({ ...prev, [name]: value }));
  };
  const handleTripSubmit = e => {
    e.preventDefault();
    if (!tripForm.vehicleId || !tripForm.driverId || !tripForm.departure || !tripForm.arrival) return;
    if (editTripId) {
      setTrips(trips.map(t => t.id === editTripId ? { ...tripForm, id: Number(tripForm.id), vehicleId: Number(tripForm.vehicleId), driverId: Number(tripForm.driverId) } : t));
      setEditTripId(null);
    } else {
      const newId = trips.length ? Math.max(...trips.map(t => t.id)) + 1 : 1;
      setTrips([...trips, { ...tripForm, id: newId, vehicleId: Number(tripForm.vehicleId), driverId: Number(tripForm.driverId) }]);
    }
    setTripForm({ id: '', vehicleId: '', driverId: '', departure: '', arrival: '', departureTime: '', arrivalTime: '', status: '' });
  };
  const handleTripEdit = trip => {
    setTripForm({ ...trip, id: String(trip.id), vehicleId: String(trip.vehicleId), driverId: String(trip.driverId) });
    setEditTripId(trip.id);
  };
  const handleTripDelete = id => {
    setTrips(trips.filter(t => t.id !== id));
    if (editTripId === id) {
      setTripForm({ id: '', vehicleId: '', driverId: '', departure: '', arrival: '', departureTime: '', arrivalTime: '', status: '' });
      setEditTripId(null);
    }
  };

  const [driverDialogOpen, setDriverDialogOpen] = React.useState(false);
  const [drivers, setDrivers] = React.useState([
    { id: 1, name: '김철수', contact: '010-1234-5678', companyId: 1001, status: '재직' },
    { id: 2, name: '이영희', contact: '010-2345-6789', companyId: 1002, status: '휴직' },
  ]);
  const [driverForm, setDriverForm] = React.useState({ name: '', contact: '', companyId: '', status: '' });
  const [editDriverId, setEditDriverId] = React.useState(null);

  const handleDriverChange = e => {
    const { name, value } = e.target;
    if (name === 'contact') {
      const onlyNums = value.replace(/[^0-9\-]/g, '');
      setDriverForm(prev => ({ ...prev, [name]: onlyNums }));
    } else {
      setDriverForm(prev => ({ ...prev, [name]: value }));
    }
  };
  const handleDriverSubmit = e => {
    e.preventDefault();
    if (!driverForm.name || !driverForm.contact || !driverForm.companyId || !driverForm.status) return;
    if (editDriverId) {
      setDrivers(drivers.map(d => d.id === editDriverId ? { ...d, ...driverForm, companyId: Number(driverForm.companyId) } : d));
      setEditDriverId(null);
    } else {
      const newId = drivers.length ? Math.max(...drivers.map(d => d.id)) + 1 : 1;
      setDrivers([...drivers, { ...driverForm, id: newId, companyId: Number(driverForm.companyId) }]);
    }
    setDriverForm({ name: '', contact: '', companyId: '', status: '' });
  };
  const handleDriverEdit = driver => {
    setDriverForm({ name: driver.name, contact: driver.contact, companyId: String(driver.companyId), status: driver.status });
    setEditDriverId(driver.id);
  };
  const handleDriverDelete = id => {
    setDrivers(drivers.filter(d => d.id !== id));
    if (editDriverId === id) {
      setDriverForm({ name: '', contact: '', companyId: '', status: '' });
      setEditDriverId(null);
    }
  };

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
              <h1 className="text-3xl font-bold text-white pointer-events-auto">{t('admin.dashboard.title')}</h1>
              <p className="text-gray-300 mt-1 pointer-events-auto">{t('admin.dashboard.overview')}</p>
            </div>
            {/* 우측: (필요시) 버튼 등 */}
            <div className="flex items-center gap-4 min-w-[220px] justify-end"></div>
          </div>
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
            {/* Quick Actions (플랫폼 관리) - 위치 그대로 */}
            <Card className="bg-gray-800 border-gray-700 rounded-xl shadow-lg p-6">
              <CardHeader>
                <CardTitle className="text-lg text-white">{t('admin.platformManagement.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start text-white" onClick={() => setUserDialogOpen(true)}>
                    <Users className="w-4 h-4 mr-2" />
                    {t('admin.platformManagement.manageUsers')}
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-white" onClick={() => setCompanyDialogOpen(true)}>
                    <Building className="w-4 h-4 mr-2" />
                    {t('admin.platformManagement.manageCompanies')}
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-white" onClick={() => setVehicleDialogOpen(true)}>
                    <Truck className="w-4 h-4 mr-2" />
                    {t('admin.platformManagement.manageVehicles')}
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-white" onClick={() => setDriverDialogOpen(true)}>
                    <User className="w-4 h-4 mr-2" />
                    {t('admin.platformManagement.manageDrivers')}
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

            {/* Performance Metrics (성과 지표) - 시스템 상태 카드 자리로 이동 */}
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

            {/* System Status (시스템 상태) - 성과 지표 카드 자리로 이동 */}
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

            {/* System Alerts (시스템 알림) - 위치를 Quick Actions 자리로 이동 */}
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
                      <div className="mt-0.5">
                        {alert.type === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-600" />}
                        {alert.type === 'error' && <AlertTriangle className="w-5 h-5 text-red-600" />}
                        {alert.type === 'success' && <CheckCircle className="w-5 h-5 text-green-600" />}
                        {alert.type === 'info' && <Clock className="w-5 h-5 text-blue-600" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-base font-semibold text-gray-900">{t(alert.message)}</p>
                        <p className="text-sm text-gray-700">{alert.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
        <DialogContent className="max-w-3xl w-full bg-[#102040] text-white">
          <DialogHeader>
            <DialogTitle className="text-white">{t('admin.platformManagement.manageUsers')}</DialogTitle>
          </DialogHeader>
          {/* CRID 예시 UI */}
          <div className="space-y-4 mt-4 overflow-x-auto">
            <form className="flex flex-wrap gap-2 min-w-[600px]" onSubmit={handleSubmit}>
              <input
                type="tel"
                className="flex-1 min-w-[120px] px-2 py-1 rounded border border-blue-900 bg-[#1a2a40] text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400"
                placeholder="전화번호"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                disabled={!!editPhone}
              />
              <input
                className="flex-1 min-w-[100px] px-2 py-1 rounded border border-blue-900 bg-[#1a2a40] text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400"
                placeholder="이름"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
              <input
                className="flex-1 min-w-[140px] px-2 py-1 rounded border border-blue-900 bg-[#1a2a40] text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400"
                placeholder="이메일"
                name="email"
                value={form.email}
                onChange={handleChange}
              />
              <select
                className="flex-1 min-w-[80px] px-2 py-1 rounded border border-blue-900 bg-[#1a2a40] text-white focus:ring-2 focus:ring-blue-400"
                name="role"
                value={form.role}
                onChange={handleChange}
                required
              >
                <option value="">권한</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="E">E</option>
              </select>
              <Button type="submit" className={`bg-blue-600 hover:bg-blue-700 text-white font-bold`}>
                {editPhone ? '저장' : '등록'}
              </Button>
              {editPhone && (
                <Button type="button" variant="outline" className="border-gray-400 text-gray-200" onClick={() => { setForm({ phone: '', name: '', email: '', role: '' }); setEditPhone(null); }}>취소</Button>
              )}
            </form>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-white">전화번호</TableHead>
                  <TableHead className="text-white">이름</TableHead>
                  <TableHead className="text-white">이메일</TableHead>
                  <TableHead className="text-white">권한</TableHead>
                  <TableHead className="text-white">액션</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.phone} className="bg-[#1a2a40] border-blue-900">
                    <TableCell className="text-white">{user.phone}</TableCell>
                    <TableCell className="text-white">{user.name}</TableCell>
                    <TableCell className="text-white">{user.email}</TableCell>
                    <TableCell className="text-white">{user.role}</TableCell>
                    <TableCell>
                      <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold mr-2" onClick={() => handleEdit(user)}>{t('common.edit') || '수정'}</Button>
                      <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white font-bold" onClick={() => handleDelete(user.phone)}>{t('common.delete') || '삭제'}</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <Button variant="outline" className="border-gray-400 text-gray-200" onClick={() => setUserDialogOpen(false)}>{t('shipper.cancel')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={companyDialogOpen} onOpenChange={setCompanyDialogOpen}>
        <DialogContent className="max-w-6xl w-full bg-[#102040] text-white">
          <DialogHeader>
            <DialogTitle className="text-white">{t('admin.platformManagement.manageCompanies')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4 overflow-x-auto">
            <form className="flex flex-wrap gap-2 min-w-[900px]" onSubmit={handleCompanySubmit}>
              <input
                type="tel"
                className="flex-1 min-w-[100px] px-2 py-1 rounded border border-blue-900 bg-[#1a2a40] text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400"
                placeholder="회사ID"
                name="id"
                value={companyForm.id}
                onChange={handleCompanyChange}
                required
                disabled={!!editCompanyId}
              />
              <input
                className="flex-1 min-w-[120px] px-2 py-1 rounded border border-blue-900 bg-[#1a2a40] text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400"
                placeholder="회사명"
                name="name"
                value={companyForm.name}
                onChange={handleCompanyChange}
                required
              />
              <input
                className="flex-1 min-w-[100px] px-2 py-1 rounded border border-blue-900 bg-[#1a2a40] text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400"
                placeholder="대표자명"
                name="ceo"
                value={companyForm.ceo}
                onChange={handleCompanyChange}
              />
              <input
                className="flex-1 min-w-[120px] px-2 py-1 rounded border border-blue-900 bg-[#1a2a40] text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400"
                placeholder="대표전화"
                name="contact"
                value={companyForm.contact}
                onChange={handleCompanyChange}
              />
              <input
                className="flex-1 min-w-[100px] px-2 py-1 rounded border border-blue-900 bg-[#1a2a40] text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400"
                placeholder="담당자명"
                name="manager"
                value={companyForm.manager}
                onChange={handleCompanyChange}
              />
              <input
                type="tel"
                className="flex-1 min-w-[120px] px-2 py-1 rounded border border-blue-900 bg-[#1a2a40] text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400"
                placeholder="담당자 연락처"
                name="managerContact"
                value={companyForm.managerContact}
                onChange={handleCompanyChange}
              />
              <Button type="submit" className={`bg-blue-600 hover:bg-blue-700 text-white font-bold`}>
                {editCompanyId ? '저장' : '등록'}
              </Button>
              {editCompanyId && (
                <Button type="button" variant="outline" className="border-gray-400 text-gray-200" onClick={() => { setCompanyForm({ id: '', name: '', ceo: '', contact: '', manager: '', managerContact: '' }); setEditCompanyId(null); }}>취소</Button>
              )}
            </form>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-white">회사ID</TableHead>
                  <TableHead className="text-white">회사명</TableHead>
                  <TableHead className="text-white">대표자명</TableHead>
                  <TableHead className="text-white">대표전화</TableHead>
                  <TableHead className="text-white">담당자명</TableHead>
                  <TableHead className="text-white">담당자 연락처</TableHead>
                  <TableHead className="text-white">액션</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companies.map((company) => (
                  <TableRow key={company.id} className="bg-[#1a2a40] border-blue-900">
                    <TableCell className="text-white">{company.id}</TableCell>
                    <TableCell className="text-white">{company.name}</TableCell>
                    <TableCell className="text-white">{company.ceo}</TableCell>
                    <TableCell className="text-white">{company.contact}</TableCell>
                    <TableCell className="text-white">{company.manager}</TableCell>
                    <TableCell className="text-white">{company.managerContact}</TableCell>
                    <TableCell>
                      <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold mr-2" onClick={() => handleCompanyEdit(company)}>수정</Button>
                      <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white font-bold" onClick={() => handleCompanyDelete(company.id)}>삭제</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <Button variant="outline" className="border-gray-400 text-gray-200" onClick={() => setCompanyDialogOpen(false)}>{t('shipper.cancel')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={vehicleDialogOpen} onOpenChange={setVehicleDialogOpen}>
        <DialogContent className="max-w-6xl w-full bg-[#102040] text-white">
          <DialogHeader>
            <DialogTitle className="text-white">{t('admin.platformManagement.manageVehicles')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4 overflow-x-auto">
            <form className="flex flex-wrap gap-2 min-w-[900px]" onSubmit={handleVehicleSubmit}>
              <input
                type="tel"
                className="flex-1 min-w-[100px] px-2 py-1 rounded border border-blue-900 bg-[#1a2a40] text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400"
                placeholder="차량ID"
                name="id"
                value={vehicleForm.id}
                onChange={handleVehicleChange}
                required
                disabled={!!editVehicleId}
              />
              <input
                className="flex-1 min-w-[120px] px-2 py-1 rounded border border-blue-900 bg-[#1a2a40] text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400"
                placeholder="차량번호"
                name="number"
                value={vehicleForm.number}
                onChange={handleVehicleChange}
                required
              />
              <input
                className="flex-1 min-w-[100px] px-2 py-1 rounded border border-blue-900 bg-[#1a2a40] text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400"
                placeholder="차종"
                name="type"
                value={vehicleForm.type}
                onChange={handleVehicleChange}
              />
              <input
                type="tel"
                className="flex-1 min-w-[100px] px-2 py-1 rounded border border-blue-900 bg-[#1a2a40] text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400"
                placeholder="적재중량(kg)"
                name="weight"
                value={vehicleForm.weight}
                onChange={handleVehicleChange}
              />
              <select
                className="flex-1 min-w-[120px] px-2 py-1 rounded border border-blue-900 bg-[#1a2a40] text-white focus:ring-2 focus:ring-blue-400"
                name="companyId"
                value={vehicleForm.companyId || ''}
                onChange={e => setVehicleForm(prev => ({ ...prev, companyId: e.target.value }))}
                required
              >
                <option value="">소유회사 선택</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <input
                className="flex-1 min-w-[100px] px-2 py-1 rounded border border-blue-900 bg-[#1a2a40] text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400"
                placeholder="운전자명"
                name="driver"
                value={vehicleForm.driver}
                onChange={handleVehicleChange}
              />
              <input
                type="tel"
                className="flex-1 min-w-[120px] px-2 py-1 rounded border border-blue-900 bg-[#1a2a40] text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400"
                placeholder="운전자 연락처"
                name="driverContact"
                value={vehicleForm.driverContact}
                onChange={handleVehicleChange}
              />
              <Button type="submit" className={`bg-blue-600 hover:bg-blue-700 text-white font-bold`}>
                {editVehicleId ? '저장' : '등록'}
              </Button>
              {editVehicleId && (
                <Button type="button" variant="outline" className="border-gray-400 text-gray-200" onClick={() => { setVehicleForm({ id: '', number: '', type: '', weight: '', companyId: '', driver: '', driverContact: '' }); setEditVehicleId(null); }}>취소</Button>
              )}
            </form>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-white">차량ID</TableHead>
                  <TableHead className="text-white">차량번호</TableHead>
                  <TableHead className="text-white">차종</TableHead>
                  <TableHead className="text-white">적재중량(kg)</TableHead>
                  <TableHead className="text-white">소유회사</TableHead>
                  <TableHead className="text-white">운전자명</TableHead>
                  <TableHead className="text-white">운전자 연락처</TableHead>
                  <TableHead className="text-white">액션</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicles.map((vehicle) => {
                  const company = companies.find(c => String(c.id) === String(vehicle.companyId));
                  return (
                    <TableRow key={vehicle.id} className="bg-[#1a2a40] border-blue-900">
                      <TableCell className="text-white">{vehicle.id}</TableCell>
                      <TableCell className="text-white">{vehicle.number}</TableCell>
                      <TableCell className="text-white">{vehicle.type}</TableCell>
                      <TableCell className="text-white">{vehicle.weight}</TableCell>
                      <TableCell className="text-white">{company ? company.name : '-'}</TableCell>
                      <TableCell className="text-white">{vehicle.driver}</TableCell>
                      <TableCell className="text-white">{vehicle.driverContact}</TableCell>
                      <TableCell>
                        <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold mr-2" onClick={() => handleVehicleEdit(vehicle)}>수정</Button>
                        <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white font-bold" onClick={() => handleVehicleDelete(vehicle.id)}>삭제</Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <Button variant="outline" className="border-gray-400 text-gray-200" onClick={() => setVehicleDialogOpen(false)}>{t('shipper.cancel')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={driverDialogOpen} onOpenChange={setDriverDialogOpen}>
        <DialogContent className="max-w-3xl w-full bg-[#102040] text-white">
          <DialogHeader>
            <DialogTitle className="text-white">{t('admin.platformManagement.manageDrivers')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4 overflow-x-auto">
            <form className="flex flex-wrap gap-2 min-w-[600px]" onSubmit={handleDriverSubmit}>
              <input
                className="flex-1 min-w-[120px] px-2 py-1 rounded border border-blue-900 bg-[#1a2a40] text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400"
                placeholder={t('driver.name') || '이름'}
                name="name"
                value={driverForm.name}
                onChange={handleDriverChange}
                required
              />
              <input
                type="tel"
                className="flex-1 min-w-[140px] px-2 py-1 rounded border border-blue-900 bg-[#1a2a40] text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400"
                placeholder={t('driver.contact') || '연락처'}
                name="contact"
                value={driverForm.contact}
                onChange={handleDriverChange}
                required
              />
              <select
                className="flex-1 min-w-[120px] px-2 py-1 rounded border border-blue-900 bg-[#1a2a40] text-white focus:ring-2 focus:ring-blue-400"
                name="companyId"
                value={driverForm.companyId}
                onChange={handleDriverChange}
                required
              >
                <option value="">{t('driver.company') || '소속회사 선택'}</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <select
                className="flex-1 min-w-[100px] px-2 py-1 rounded border border-blue-900 bg-[#1a2a40] text-white focus:ring-2 focus:ring-blue-400"
                name="status"
                value={driverForm.status}
                onChange={handleDriverChange}
                required
              >
                <option value="">{t('driver.status') || '상태 선택'}</option>
                <option value="재직">{t('driver.status.재직')}</option>
                <option value="휴직">{t('driver.status.휴직')}</option>
                <option value="퇴사">{t('driver.status.퇴사')}</option>
              </select>
              <Button type="submit" className={`bg-blue-600 hover:bg-blue-700 text-white font-bold`}>
                {editDriverId ? t('common.save') || '저장' : t('common.register') || '등록'}
              </Button>
              {editDriverId && (
                <Button type="button" variant="outline" className="border-gray-400 text-gray-200" onClick={() => { setDriverForm({ name: '', contact: '', companyId: '', status: '' }); setEditDriverId(null); }}>{t('common.cancel') || '취소'}</Button>
              )}
            </form>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-white">{t('driver.name') || '이름'}</TableHead>
                  <TableHead className="text-white">{t('driver.contact') || '연락처'}</TableHead>
                  <TableHead className="text-white">{t('driver.company') || '소속회사'}</TableHead>
                  <TableHead className="text-white">{t('driver.status') || '상태'}</TableHead>
                  <TableHead className="text-white">{t('common.action') || '액션'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {drivers.map((driver) => {
                  const company = companies.find(c => String(c.id) === String(driver.companyId));
                  return (
                    <TableRow key={driver.id} className="bg-[#1a2a40] border-blue-900">
                      <TableCell className="text-white">{driver.name}</TableCell>
                      <TableCell className="text-white">{driver.contact}</TableCell>
                      <TableCell className="text-white">{company ? company.name : '-'}</TableCell>
                      <TableCell className="text-white">{t('driver.status.' + driver.status) || driver.status}</TableCell>
                      <TableCell>
                        <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold mr-2" onClick={() => handleDriverEdit(driver)}>{t('common.edit') || '수정'}</Button>
                        <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white font-bold" onClick={() => handleDriverDelete(driver.id)}>{t('common.delete') || '삭제'}</Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <Button variant="outline" className="border-gray-400 text-gray-200" onClick={() => setDriverDialogOpen(false)}>{t('shipper.cancel')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={tripDialogOpen} onOpenChange={setTripDialogOpen}>
        <DialogContent className="max-w-6xl w-full bg-[#102040] text-white">
          <DialogHeader>
            <DialogTitle className="text-white">{t('admin.platformManagement.manageTrips') || '차량운행 내역 관리'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4 overflow-x-auto">
            <form className="flex flex-wrap gap-2 min-w-[900px]" onSubmit={handleTripSubmit}>
              <select
                className="flex-1 min-w-[120px] px-2 py-1 rounded border border-blue-900 bg-[#1a2a40] text-white focus:ring-2 focus:ring-blue-400"
                name="vehicleId"
                value={tripForm.vehicleId}
                onChange={handleTripChange}
                required
              >
                <option value="">차량 선택</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>{v.number}</option>
                ))}
              </select>
              <select
                className="flex-1 min-w-[120px] px-2 py-1 rounded border border-blue-900 bg-[#1a2a40] text-white focus:ring-2 focus:ring-blue-400"
                name="driverId"
                value={tripForm.driverId}
                onChange={handleTripChange}
                required
              >
                <option value="">운전자 선택</option>
                {users.map((u) => (
                  <option key={u.phone} value={u.phone}>{u.name}</option>
                ))}
              </select>
              <input className="flex-1 min-w-[120px] px-2 py-1 rounded border border-blue-900 bg-[#1a2a40] text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400" placeholder="출발지" name="departure" value={tripForm.departure} onChange={handleTripChange} required />
              <input className="flex-1 min-w-[120px] px-2 py-1 rounded border border-blue-900 bg-[#1a2a40] text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400" placeholder="도착지" name="arrival" value={tripForm.arrival} onChange={handleTripChange} required />
              <input type="datetime-local" className="flex-1 min-w-[180px] px-2 py-1 rounded border border-blue-900 bg-[#1a2a40] text-white focus:ring-2 focus:ring-blue-400" name="departureTime" value={tripForm.departureTime} onChange={handleTripChange} />
              <input type="datetime-local" className="flex-1 min-w-[180px] px-2 py-1 rounded border border-blue-900 bg-[#1a2a40] text-white focus:ring-2 focus:ring-blue-400" name="arrivalTime" value={tripForm.arrivalTime} onChange={handleTripChange} />
              <select className="flex-1 min-w-[100px] px-2 py-1 rounded border border-blue-900 bg-[#1a2a40] text-white focus:ring-2 focus:ring-blue-400" name="status" value={tripForm.status} onChange={handleTripChange}>
                <option value="">상태 선택</option>
                <option value="완료">완료</option>
                <option value="진행중">진행중</option>
                <option value="대기">대기</option>
              </select>
              <Button type="submit" className={`bg-blue-600 hover:bg-blue-700 text-white font-bold`}>
                {editTripId ? '저장' : '등록'}
              </Button>
              {editTripId && (
                <Button type="button" variant="outline" className="border-gray-400 text-gray-200" onClick={() => { setTripForm({ id: '', vehicleId: '', driverId: '', departure: '', arrival: '', departureTime: '', arrivalTime: '', status: '' }); setEditTripId(null); }}>취소</Button>
              )}
            </form>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-white">운행ID</TableHead>
                  <TableHead className="text-white">차량번호</TableHead>
                  <TableHead className="text-white">운전자명</TableHead>
                  <TableHead className="text-white">출발지</TableHead>
                  <TableHead className="text-white">도착지</TableHead>
                  <TableHead className="text-white">출발일시</TableHead>
                  <TableHead className="text-white">도착일시</TableHead>
                  <TableHead className="text-white">상태</TableHead>
                  <TableHead className="text-white">액션</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trips.map((trip) => {
                  const vehicle = vehicles.find(v => String(v.id) === String(trip.vehicleId));
                  const driver = users.find(u => String(u.phone) === String(trip.driverId));
                  return (
                    <TableRow key={trip.id} className="bg-[#1a2a40] border-blue-900">
                      <TableCell className="text-white">{trip.id}</TableCell>
                      <TableCell className="text-white">{vehicle ? vehicle.number : '-'}</TableCell>
                      <TableCell className="text-white">{driver ? driver.name : '-'}</TableCell>
                      <TableCell className="text-white">{trip.departure}</TableCell>
                      <TableCell className="text-white">{trip.arrival}</TableCell>
                      <TableCell className="text-white">{trip.departureTime?.replace('T', ' ')}</TableCell>
                      <TableCell className="text-white">{trip.arrivalTime?.replace('T', ' ')}</TableCell>
                      <TableCell className="text-white">{trip.status}</TableCell>
                      <TableCell>
                        <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold mr-2" onClick={() => handleTripEdit(trip)}>수정</Button>
                        <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white font-bold" onClick={() => handleTripDelete(trip.id)}>삭제</Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <Button variant="outline" className="border-gray-400 text-gray-200" onClick={() => setTripDialogOpen(false)}>{t('shipper.cancel')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPage;
