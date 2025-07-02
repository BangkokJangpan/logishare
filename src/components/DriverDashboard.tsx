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
    eta: "4h 32m",
    startDate: getToday(),
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

  const [vehicles, setVehicles] = useState([
    { id: 2001, number: '12가3456' },
    { id: 2002, number: '34나5678' },
    { id: 2003, number: '56다7890' },
    { id: 2004, number: '78라1234' },
    { id: 2005, number: '90마5678' },
  ]);

  const [companies, setCompanies] = useState([
    { id: 1001, name: '로지쉐어' },
    { id: 1002, name: '스마트물류' },
    { id: 1003, name: '에코트랜스' },
    { id: 1004, name: '글로벌로지' },
    { id: 1005, name: '이지카고' },
  ]);

  const [drivers, setDrivers] = useState([
    { id: 1, name: '김철수' },
    { id: 2, name: '이영희' },
    { id: 3, name: '박기사' },
    { id: 4, name: '최운전' },
    { id: 5, name: '정기사' },
  ]);

  // 공차 운행 등록 팝업 상태 및 핸들러
  const [emptyRunDialogOpen, setEmptyRunDialogOpen] = useState(false);
  const [loadDetailDialogOpen, setLoadDetailDialogOpen] = useState(false);
  const [selectedLoad, setSelectedLoad] = useState(null);
  const [emptyRuns, setEmptyRuns] = useState([
    { id: 3001, vehicleId: 2001, driverId: 1, companyId: 1001, startLocation: '서울', endLocation: '부산', startDate: '2024-01-15', startTime: '09:00', estimatedArrivalTime: '18:00', capacity: 3000, status: '예정', cargo: '전자제품', estimatedEarning: '$1,250', progress: 65, eta: '4h 32m', distance: '387 miles' },
    { id: 3002, vehicleId: 2002, driverId: 2, companyId: 1002, startLocation: '대구', endLocation: '인천', startDate: '2024-01-16', startTime: '10:00', estimatedArrivalTime: '19:00', capacity: 2500, status: '진행중', cargo: '자동차부품', estimatedEarning: '$1,800', progress: 15, eta: '18h 45m', distance: '890 miles' },
    { id: 3003, vehicleId: 2003, driverId: 3, companyId: 1003, startLocation: '광주', endLocation: '대전', startDate: '2024-01-17', startTime: '08:00', estimatedArrivalTime: '17:00', capacity: 4000, status: '완료', cargo: '식품', estimatedEarning: '$1,400', progress: 100, eta: '도착', distance: '520 miles' }
  ]);
  const [emptyRunForm, setEmptyRunForm] = useState({ 
    vehicleId: '', driverId: '', companyId: '', startLocation: '', endLocation: '', 
    startDate: '', startTime: '', estimatedArrivalTime: '', capacity: '', status: '',
    cargo: '', estimatedEarning: '', progress: '', eta: '', distance: ''
  });
  const [editEmptyRunId, setEditEmptyRunId] = useState(null);

  const [selectedStatus, setSelectedStatus] = useState('예정');
  const [selectedDate, setSelectedDate] = useState(getToday());
  const matchedEmptyRuns = emptyRuns.filter(er => er.status === selectedStatus && er.startDate === selectedDate);

  const handleEmptyRunChange = e => {
    const { name, value } = e.target;
    if (name === 'vehicleId' || name === 'driverId' || name === 'companyId' || name === 'capacity' || name === 'progress') {
      const onlyNums = value.replace(/[^0-9]/g, '');
      setEmptyRunForm(prev => ({ ...prev, [name]: onlyNums }));
    } else {
      setEmptyRunForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleEmptyRunSubmit = e => {
    e.preventDefault();
    if (!emptyRunForm.vehicleId || !emptyRunForm.startLocation || !emptyRunForm.endLocation) return;
    let newStatus = emptyRunForm.status;
    let newDate = emptyRunForm.startDate;
    const driverIdNum = emptyRunForm.driverId ? Number(emptyRunForm.driverId) : undefined;
    const companyIdNum = emptyRunForm.companyId ? Number(emptyRunForm.companyId) : undefined;
    if (editEmptyRunId !== null && editEmptyRunId !== undefined) {
      setEmptyRuns(emptyRuns.map(er =>
        Number(er.id) === Number(editEmptyRunId)
          ? {
              ...er,
              ...emptyRunForm,
              id: Number(editEmptyRunId),
              vehicleId: Number(emptyRunForm.vehicleId),
              driverId: driverIdNum,
              companyId: companyIdNum,
              capacity: Number(emptyRunForm.capacity),
              progress: Number(emptyRunForm.progress),
            }
          : er
      ));
      setEditEmptyRunId(null);
    } else {
      const nextId =
        emptyRuns.length > 0
          ? Math.max(...emptyRuns.map(er => Number(er.id))) + 1
          : 1;
      setEmptyRuns([
        ...emptyRuns,
        {
          ...emptyRunForm,
          id: Number(nextId),
          vehicleId: Number(emptyRunForm.vehicleId),
          driverId: driverIdNum,
          companyId: companyIdNum,
          capacity: Number(emptyRunForm.capacity),
          progress: Number(emptyRunForm.progress),
        },
      ]);
    }
    setSelectedStatus(newStatus);
    setSelectedDate(newDate);
    setEmptyRunForm({
      vehicleId: '',
      driverId: '',
      companyId: '',
      startLocation: '',
      endLocation: '',
      startDate: '',
      startTime: '',
      estimatedArrivalTime: '',
      capacity: '',
      status: '',
      cargo: '',
      estimatedEarning: '',
      progress: '',
      eta: '',
      distance: '',
    });
  };

  const handleEmptyRunEdit = emptyRun => {
    setEmptyRunForm({
      vehicleId: emptyRun.vehicleId ? String(emptyRun.vehicleId) : '',
      driverId: emptyRun.driverId ? String(emptyRun.driverId) : '',
      companyId: emptyRun.companyId ? String(emptyRun.companyId) : '',
      capacity: emptyRun.capacity !== undefined && emptyRun.capacity !== null ? String(emptyRun.capacity) : '',
      progress: emptyRun.progress !== undefined && emptyRun.progress !== null ? String(emptyRun.progress) : '',
      cargo: emptyRun.cargo || '',
      estimatedEarning: emptyRun.estimatedEarning || '',
      eta: emptyRun.eta || '',
      distance: emptyRun.distance || '',
      startLocation: emptyRun.startLocation || '',
      endLocation: emptyRun.endLocation || '',
      startDate: emptyRun.startDate || '',
      startTime: emptyRun.startTime || '',
      estimatedArrivalTime: emptyRun.estimatedArrivalTime || '',
      status: emptyRun.status || '',
    });
    setEditEmptyRunId(String(emptyRun.id));
  };

  const handleEmptyRunDelete = id => {
    setEmptyRuns(emptyRuns.filter(er => er.id !== id));
    if (editEmptyRunId === id) {
      setEmptyRunForm({ vehicleId: '', driverId: '', companyId: '', startLocation: '', endLocation: '', startDate: '', startTime: '', estimatedArrivalTime: '', capacity: '', status: '', cargo: '', estimatedEarning: '', progress: '', eta: '', distance: '' });
      setEditEmptyRunId(null);
    }
  };

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

  // 가장 최근 공차 운행 데이터
  const latestEmptyRun = emptyRuns.length > 0 ? emptyRuns[emptyRuns.length - 1] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 p-6 text-foreground">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 relative">
          <div className="flex items-center justify-between">
            {/* 좌측: 홈버튼 */}
            <a
              href="/"
              className="block w-full min-h-[56px] flex items-center gap-2 px-4 cursor-pointer no-underline"
              style={{height: '100%'}}
            >
              <Logo />
            </a>
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
                      <CardTitle className="text-xl text-white">{t('driver.emptyRun')}</CardTitle>
                      <CardDescription className="text-gray-300">운행 ID: {matchedEmptyRuns.length === 0 ? '-' : matchedEmptyRuns[0].id}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      className="px-2 py-1 rounded border border-gray-600 bg-gray-900 text-white focus:ring-2 focus:ring-blue-400"
                      value={selectedDate}
                      onChange={e => setSelectedDate(e.target.value)}
                      style={{ minWidth: 120 }}
                    />
                    <Button
                      size="sm"
                      className={selectedStatus === '예정' ? 'bg-blue-600 text-white font-bold border border-blue-400' : selectedStatus === '진행중' ? 'bg-yellow-500 text-black font-bold border border-yellow-400' : 'bg-green-600 text-white font-bold border border-green-400'}
                      style={{ minWidth: 70 }}
                      onClick={() => {
                        const nextStatus = selectedStatus === '예정' ? '진행중' : selectedStatus === '진행중' ? '완료' : '예정';
                        setSelectedStatus(nextStatus);
                      }}
                    >
                      {selectedStatus}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {matchedEmptyRuns.length === 0 ? (
                  <div className="grid gap-6 mb-6">
                    <div className="bg-gray-800 border-gray-700 rounded-xl shadow-lg p-6 min-h-[200px] flex flex-col justify-center items-center">
                      <span className="text-gray-400 text-lg font-semibold">해당 날짜/상태의 공차 운행 데이터가 없습니다.</span>
                    </div>
                  </div>
                ) : (
                  <div className={`grid gap-6 mb-6 grid-cols-1`} style={{ minHeight: `${Math.max(matchedEmptyRuns.length * 200, 200)}px` }}>
                    {matchedEmptyRuns
                      .slice()
                      .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''))
                      .map((run) => (
                        <div key={run.id} className="bg-gray-800 border-gray-700 rounded-xl shadow-lg p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Package className="w-5 h-5 text-complementary" />
                              <span className="text-white font-medium">{run.vehicleId}</span>
                            </div>
                            <span className="text-gray-300 font-semibold">출발예정 : <span className="text-white font-semibold">{run.startTime || '-'}</span></span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 mt-2">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-green-400" />
                              <div>
                                <p className="text-sm text-gray-300">{t('driver.pickup')}</p>
                                <p className="font-medium text-white">{run.startLocation || '-'}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-red-400" />
                              <div>
                                <p className="text-sm text-gray-300">{t('driver.delivery')}</p>
                                <p className="font-medium text-white">{run.endLocation || '-'}</p>
                              </div>
                            </div>
                          </div>
                          <div className="bg-gray-900 rounded-lg p-4 mt-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-gray-300">{t('driver.progress')}</span>
                              <span className="text-sm font-medium text-white">{run.progress !== undefined ? run.progress + '%' : '-'}</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-logistics-primary h-2 rounded-full transition-all duration-300"
                                style={{ width: run.progress !== undefined ? `${run.progress}%` : '0%' }}
                              ></div>
                            </div>
                            <div className="flex items-center justify-between mt-3 text-sm">
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4 text-complementary" />
                                <span className="text-white">{t('driver.eta')}: {run.eta || '-'}</span>
                              </div>
                              <span className="text-gray-300">{run.distance || '-'}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
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
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-white border-gray-600"
                          onClick={() => {
                            setSelectedLoad(load);
                            setLoadDetailDialogOpen(true);
                          }}
                        >
                          {t('driver.details')}
                        </Button>
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
                  <Button variant="outline" className="w-full justify-start text-white border-gray-600" onClick={() => setEmptyRunDialogOpen(true)}>
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

      {/* 공차 운행 등록 팝업 */}
      <Dialog open={emptyRunDialogOpen} onOpenChange={setEmptyRunDialogOpen}>
        <DialogContent className="max-w-7xl w-full bg-[#0f1a2e] text-white">
          <DialogHeader>
            <DialogTitle className="text-white text-2xl font-bold">{t('emptyRun.title')}</DialogTitle>
            <p className="text-gray-300 text-base leading-relaxed">{t('emptyRun.description')}</p>
          </DialogHeader>
          <div className="space-y-4 mt-4 overflow-x-auto">
            <form className="flex flex-col gap-3 min-w-[1200px]" onSubmit={handleEmptyRunSubmit}>
              <div className="flex gap-2">
                <select className="flex-1 min-w-[120px] px-2 py-1 rounded border border-[#2d4a6b] bg-[#1a2a40] text-white focus:ring-2 focus:ring-blue-400" name="companyId" value={emptyRunForm.companyId} onChange={handleEmptyRunChange} required>
                  <option value="">회사 선택</option>
                  {companies.map((company) => (<option key={company.company_id} value={company.company_id}>{company.company_name}</option>))}
                </select>
                <select className="flex-1 min-w-[120px] px-2 py-1 rounded border border-[#2d4a6b] bg-[#1a2a40] text-white focus:ring-2 focus:ring-blue-400" name="vehicleId" value={emptyRunForm.vehicleId} onChange={handleEmptyRunChange} required>
                  <option value="">차량 선택</option>
                  {vehicles.map((vehicle) => (<option key={vehicle.id} value={String(vehicle.id)}>{vehicle.number}</option>))}
                </select>
                <select className="flex-1 min-w-[120px] px-2 py-1 rounded border border-[#2d4a6b] bg-[#1a2a40] text-white focus:ring-2 focus:ring-blue-400" name="driverId" value={emptyRunForm.driverId} onChange={handleEmptyRunChange} required>
                  <option value="">운전자 선택</option>
                  {drivers.map((driver) => (<option key={driver.id} value={driver.id}>{driver.name}</option>))}
                </select>
                <input className="flex-1 min-w-[100px] px-2 py-1 rounded border border-[#2d4a6b] bg-[#1a2a40] text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400" placeholder={t('emptyRun.capacity')} name="capacity" value={String(emptyRunForm.capacity)} onChange={handleEmptyRunChange} required />
              </div>
              <div className="flex gap-2">
                <input className="flex-1 min-w-[120px] px-2 py-1 rounded border border-[#2d4a6b] bg-[#1a2a40] text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400" placeholder={t('emptyRun.startLocation')} name="startLocation" value={emptyRunForm.startLocation} onChange={handleEmptyRunChange} required />
                <input className="flex-1 min-w-[120px] px-2 py-1 rounded border border-[#2d4a6b] bg-[#1a2a40] text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400" placeholder={t('emptyRun.endLocation')} name="endLocation" value={emptyRunForm.endLocation} onChange={handleEmptyRunChange} required />
                <input type="date" className="flex-1 min-w-[140px] px-2 py-1 rounded border border-[#2d4a6b] bg-[#1a2a40] text-white focus:ring-2 focus:ring-blue-400" name="startDate" value={emptyRunForm.startDate} onChange={handleEmptyRunChange} required />
                <input type="time" className="flex-1 min-w-[100px] px-2 py-1 rounded border border-[#2d4a6b] bg-[#1a2a40] text-white focus:ring-2 focus:ring-blue-400" name="startTime" value={emptyRunForm.startTime} onChange={handleEmptyRunChange} required />
                <input type="time" className="flex-1 min-w-[100px] px-2 py-1 rounded border border-[#2d4a6b] bg-[#1a2a40] text-white focus:ring-2 focus:ring-blue-400" name="estimatedArrivalTime" value={emptyRunForm.estimatedArrivalTime} onChange={handleEmptyRunChange} required />
                <select className="flex-1 min-w-[100px] px-2 py-1 rounded border border-[#2d4a6b] bg-[#1a2a40] text-white focus:ring-2 focus:ring-blue-400" name="status" value={emptyRunForm.status} onChange={handleEmptyRunChange} required>
                  <option value="">{t('emptyRun.status')}</option>
                  <option value="예정">예정</option>
                  <option value="진행중">진행중</option>
                  <option value="완료">완료</option>
                  <option value="취소">취소</option>
                </select>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
                  {editEmptyRunId ? t('emptyRun.save') : t('emptyRun.register')}
                </Button>
                {editEmptyRunId && (
                  <Button type="button" variant="outline" className="border-gray-400 text-gray-200" onClick={() => { setEmptyRunForm({ vehicleId: '', driverId: '', companyId: '', startLocation: '', endLocation: '', startDate: '', startTime: '', estimatedArrivalTime: '', capacity: '', status: '', cargo: '', estimatedEarning: '', progress: '', eta: '', distance: '' }); setEditEmptyRunId(null); }}>{t('emptyRun.cancel')}</Button>
                )}
              </div>
            </form>
            <Table className="min-w-[1200px] w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-white">{t('emptyRun.id')}</TableHead>
                  <TableHead className="text-white">회사명</TableHead>
                  <TableHead className="text-white">차량번호</TableHead>
                  <TableHead className="text-white">운전자명</TableHead>
                  <TableHead className="text-white">{t('emptyRun.startLocation')}</TableHead>
                  <TableHead className="text-white">{t('emptyRun.endLocation')}</TableHead>
                  <TableHead className="text-white">출발일자</TableHead>
                  <TableHead className="text-white">출발시각</TableHead>
                  <TableHead className="text-white">도착예정시각</TableHead>
                  <TableHead className="text-white">{t('emptyRun.capacity')}</TableHead>
                  <TableHead className="text-white">{t('emptyRun.status')}</TableHead>
                  <TableHead className="text-white">{t('emptyRun.action')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {emptyRuns.map((emptyRun) => (
                  <TableRow key={emptyRun.id} className="bg-[#1a2a40] border-blue-900">
                    <TableCell className="text-white">{emptyRun.id}</TableCell>
                    <TableCell className="text-white">{companies.find(c => c.company_id === Number(emptyRun.companyId))?.company_name || '-'}</TableCell>
                    <TableCell className="text-white">{emptyRun.vehicleId}</TableCell>
                    <TableCell className="text-white">{drivers.find(d => d.id === Number(emptyRun.driverId))?.name || '-'}</TableCell>
                    <TableCell className="text-white">{emptyRun.startLocation}</TableCell>
                    <TableCell className="text-white">{emptyRun.endLocation}</TableCell>
                    <TableCell className="text-white">{emptyRun.startDate}</TableCell>
                    <TableCell className="text-white">{emptyRun.startTime?.replace('T', ' ')}</TableCell>
                    <TableCell className="text-white">{emptyRun.estimatedArrivalTime?.replace('T', ' ')}</TableCell>
                    <TableCell className="text-white">{emptyRun.capacity}</TableCell>
                    <TableCell className="text-white">{emptyRun.status}</TableCell>
                    <TableCell>
                      <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold mr-2" onClick={() => handleEmptyRunEdit(emptyRun)}>{t('emptyRun.edit')}</Button>
                      <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white font-bold" onClick={() => handleEmptyRunDelete(emptyRun.id)}>{t('emptyRun.delete')}</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <Button variant="outline" className="border-gray-400 text-gray-200" onClick={() => setEmptyRunDialogOpen(false)}>{t('emptyRun.close')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 화물 상세 정보 팝업 */}
      <Dialog open={loadDetailDialogOpen} onOpenChange={setLoadDetailDialogOpen}>
        <DialogContent className="max-w-4xl w-full bg-[#0f1a2e] text-white">
          <DialogHeader>
            <DialogTitle className="text-white text-2xl font-bold">화물 상세 정보</DialogTitle>
            <p className="text-gray-300 text-base leading-relaxed">선택한 화물의 상세 정보를 확인하세요.</p>
          </DialogHeader>
          <div className="space-y-6 mt-4">
            {selectedLoad ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-gray-800 border-gray-700 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-3">기본 정보</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-300">화물 ID:</span>
                        <span className="text-white font-medium">{selectedLoad.id || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">화물 종류:</span>
                        <span className="text-white font-medium">{selectedLoad.cargo || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">수익:</span>
                        <span className="text-logistics-primary font-semibold">{selectedLoad.earning || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">매칭 점수:</span>
                        <span className="text-white font-medium">{selectedLoad.matchScore || '-'}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800 border-gray-700 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-3">운송 정보</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-300">픽업지:</span>
                        <span className="text-white font-medium">{selectedLoad.pickup || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">배송지:</span>
                        <span className="text-white font-medium">{selectedLoad.delivery || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">거리:</span>
                        <span className="text-white font-medium">{selectedLoad.distance || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">무게:</span>
                        <span className="text-white font-medium">{selectedLoad.weight || '-'}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gray-800 border-gray-700 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-3">추가 정보</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-300">긴급 여부:</span>
                        <span className={`font-medium ${selectedLoad.urgent ? 'text-red-400' : 'text-green-400'}`}>
                          {selectedLoad.urgent ? '긴급' : '일반'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">상태:</span>
                        <span className="text-white font-medium">대기중</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">등록일:</span>
                        <span className="text-white font-medium">{getToday()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">예상 소요시간:</span>
                        <span className="text-white font-medium">-</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800 border-gray-700 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-3">요구사항</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-300">차량 요구사항:</span>
                        <span className="text-white font-medium">-</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">운전자 요구사항:</span>
                        <span className="text-white font-medium">-</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">특별 요구사항:</span>
                        <span className="text-white font-medium">-</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-300">선택된 화물 정보가 없습니다.</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" className="border-gray-400 text-gray-200" onClick={() => setLoadDetailDialogOpen(false)}>
              닫기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DriverDashboard;
