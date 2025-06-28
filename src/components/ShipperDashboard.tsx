import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Package, 
  MapPin, 
  Clock, 
  DollarSign, 
  Truck, 
  Star,
  Plus,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
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


const ShipperDashboard = () => {
  const { t } = useLanguage();
  const [showLoadForm, setShowLoadForm] = useState(false);

  // 물류 요청 팝업 상태 및 핸들러
  const [logisticsRequestDialogOpen, setLogisticsRequestDialogOpen] = useState(false);
  const [logisticsRequests, setLogisticsRequests] = useState([
    { id: 4001, shipperId: 1001, cargoType: '전자제품', startLocation: '서울', endLocation: '부산', startTime: '2024-01-15 10:00', endTime: '2024-01-15 20:00', weight: 5000, priority: '긴급', status: '대기중' },
    { id: 4002, shipperId: 1002, cargoType: '자동차부품', startLocation: '대구', endLocation: '인천', startTime: '2024-01-16 09:00', endTime: '2024-01-16 18:00', weight: 3000, priority: '일반', status: '진행중' },
    { id: 4003, shipperId: 1003, cargoType: '식품', startLocation: '광주', endLocation: '대전', startTime: '2024-01-17 08:00', endTime: '2024-01-17 17:00', weight: 2000, priority: '특급', status: '완료' }
  ]);
  const [logisticsRequestForm, setLogisticsRequestForm] = useState({ 
    id: '', shipperId: '', cargoType: '', startLocation: '', endLocation: '', 
    startTime: '', endTime: '', weight: '', priority: '', status: '' 
  });
  const [editLogisticsRequestId, setEditLogisticsRequestId] = useState(null);

  const handleLogisticsRequestChange = e => {
    const { name, value } = e.target;
    if (name === 'id' || name === 'shipperId' || name === 'weight') {
      const onlyNums = value.replace(/[^0-9]/g, '');
      setLogisticsRequestForm(prev => ({ ...prev, [name]: onlyNums }));
    } else {
      setLogisticsRequestForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleLogisticsRequestSubmit = e => {
    e.preventDefault();
    if (!logisticsRequestForm.id || !logisticsRequestForm.shipperId || !logisticsRequestForm.startLocation || !logisticsRequestForm.endLocation) return;
    if (editLogisticsRequestId) {
      setLogisticsRequests(logisticsRequests.map(lr => lr.id === editLogisticsRequestId ? { 
        ...logisticsRequestForm, 
        id: Number(logisticsRequestForm.id), 
        shipperId: Number(logisticsRequestForm.shipperId), 
        weight: Number(logisticsRequestForm.weight) 
      } : lr));
      setEditLogisticsRequestId(null);
    } else {
      if (logisticsRequests.some(lr => lr.id === Number(logisticsRequestForm.id))) return;
      setLogisticsRequests([...logisticsRequests, { 
        ...logisticsRequestForm, 
        id: Number(logisticsRequestForm.id), 
        shipperId: Number(logisticsRequestForm.shipperId), 
        weight: Number(logisticsRequestForm.weight) 
      }]);
    }
    setLogisticsRequestForm({ id: '', shipperId: '', cargoType: '', startLocation: '', endLocation: '', startTime: '', endTime: '', weight: '', priority: '', status: '' });
  };

  const handleLogisticsRequestEdit = logisticsRequest => {
    setLogisticsRequestForm({ 
      ...logisticsRequest, 
      id: String(logisticsRequest.id), 
      shipperId: String(logisticsRequest.shipperId), 
      weight: String(logisticsRequest.weight) 
    });
    setEditLogisticsRequestId(logisticsRequest.id);
  };

  const handleLogisticsRequestDelete = id => {
    setLogisticsRequests(logisticsRequests.filter(lr => lr.id !== id));
    if (editLogisticsRequestId === id) {
      setLogisticsRequestForm({ id: '', shipperId: '', cargoType: '', startLocation: '', endLocation: '', startTime: '', endTime: '', weight: '', priority: '', status: '' });
      setEditLogisticsRequestId(null);
    }
  };

  const activeShipments = [
    {
      id: "SHP-001",
      cargo: "Electronics Shipment",
      driver: "John Smith",
      rating: 4.9,
      pickup: "Los Angeles, CA",
      delivery: "Phoenix, AZ",
      status: "in-transit",
      progress: 65,
      eta: "4h 32m",
      cost: "$1,250"
    },
    {
      id: "SHP-002",
      cargo: "Auto Parts",
      driver: "Maria Garcia",
      rating: 4.8,
      pickup: "Phoenix, AZ",
      delivery: "Denver, CO",
      status: "picked-up",
      progress: 15,
      eta: "18h 45m",
      cost: "$1,800"
    }
  ];

  const matchedDrivers = [
    {
      id: "DRV-001",
      name: "Michael Johnson",
      rating: 4.9,
      completedTrips: 342,
      vehicleType: "53ft Dry Van",
      capacity: "80,000 lbs",
      rate: "$1,450",
      eta: "2h 30m",
      matchScore: 98
    },
    {
      id: "DRV-002",
      name: "Sarah Wilson",
      rating: 4.7,
      completedTrips: 278,
      vehicleType: "48ft Reefer",
      capacity: "75,000 lbs",
      rate: "$1,380",
      eta: "3h 15m",
      matchScore: 94
    },
    {
      id: "DRV-003",
      name: "Robert Chen",
      rating: 4.8,
      completedTrips: 189,
      vehicleType: "53ft Dry Van",
      capacity: "80,000 lbs",
      rate: "$1,520",
      eta: "1h 45m",
      matchScore: 91
    }
  ];

  const stats = [
    { label: t('shipper.stats.activeShipments'), value: "12", icon: Package, color: "text-blue-600" },
    { label: t('shipper.stats.thisMonthCost'), value: "$18,450", icon: DollarSign, color: "text-green-600" },
    { label: t('shipper.stats.onTimeDelivery'), value: "97.2%", icon: CheckCircle, color: "text-purple-600" },
    { label: t('shipper.stats.avgSavings'), value: "23%", icon: AlertTriangle, color: "text-orange-600" }
  ];

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
              <h1 className="text-3xl font-bold text-white pointer-events-auto">{t('shipper.dashboard.title')}</h1>
              <p className="text-gray-300 mt-1 pointer-events-auto">{t('shipper.dashboard.welcome')}</p>
            </div>
            {/* 우측: 버튼 */}
            <div className="flex items-center gap-4 min-w-[220px] justify-end">
              <Button 
                onClick={() => setShowLoadForm(true)}
                className="logistics-button-primary"
              >
                <Plus className="w-4 h-4 mr-2 text-complementary" />
                {t('shipper.dashboard.postNewLoad')}
              </Button>
              <Button variant="outline" className="text-white border-gray-600">
                <Search className="w-4 h-4 mr-2 text-complementary" />
                {t('shipper.dashboard.findDrivers')}
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

        {/* Load Posting Form Modal */}
        {showLoadForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">{t('shipper.postNewLoad')}</CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowLoadForm(false)}
                  >
                    ✕
                  </Button>
                </div>
                <CardDescription>{t('shipper.fillDetails')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cargo-type">{t('shipper.cargoType')}</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder={t('shipper.selectCargoType')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="electronics">{t('shipper.electronics')}</SelectItem>
                        <SelectItem value="auto-parts">{t('shipper.autoParts')}</SelectItem>
                        <SelectItem value="food">{t('shipper.foodProducts')}</SelectItem>
                        <SelectItem value="furniture">{t('shipper.furniture')}</SelectItem>
                        <SelectItem value="other">{t('shipper.other')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="weight">{t('shipper.weight')}</Label>
                    <Input id="weight" placeholder={t('shipper.weightPlaceholder')} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pickup">{t('shipper.pickupLocation')}</Label>
                    <Input id="pickup" placeholder={t('shipper.cityState')} />
                  </div>
                  <div>
                    <Label htmlFor="delivery">{t('shipper.deliveryLocation')}</Label>
                    <Input id="delivery" placeholder={t('shipper.cityState')} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pickup-date">{t('shipper.pickupDate')}</Label>
                    <Input id="pickup-date" type="date" />
                  </div>
                  <div>
                    <Label htmlFor="delivery-date">{t('shipper.deliveryDate')}</Label>
                    <Input id="delivery-date" type="date" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="special-requirements">{t('shipper.specialRequirements')}</Label>
                  <Textarea 
                    id="special-requirements" 
                    placeholder={t('shipper.specialRequirementsPlaceholder')}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="budget">{t('shipper.budgetRange')}</Label>
                    <Input id="budget" placeholder={t('shipper.budgetPlaceholder')} />
                  </div>
                  <div>
                    <Label htmlFor="priority">{t('shipper.priorityLevel')}</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder={t('shipper.selectPriority')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">{t('shipper.standard')}</SelectItem>
                        <SelectItem value="urgent">{t('shipper.urgent')}</SelectItem>
                        <SelectItem value="express">{t('shipper.express')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button className="logistics-button-primary flex-1">{t('shipper.postLoadAndFindMatches')}</Button>
                  <Button variant="outline" onClick={() => setShowLoadForm(false)}>{t('shipper.cancel')}</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Active Shipments */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Shipments */}
            <Card className="bg-gray-800 border-gray-700 rounded-xl shadow-lg p-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl text-white">{t('shipper.activeShipments')}</CardTitle>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2 text-complementary" />
                    {t('shipper.filter')}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeShipments.map((shipment) => (
                    <div key={shipment.id} className="border border-gray-700 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                            <Package className="w-5 h-5 text-complementary" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-white">{shipment.cargo}</h4>
                            <p className="text-sm text-gray-300">ID: {shipment.id}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={
                            shipment.status === 'in-transit' ? 'status-active' : 
                            shipment.status === 'picked-up' ? 'status-pending' : 'status-inactive'
                          }>
                            {shipment.status.replace('-', ' ')}
                          </Badge>
                          <p className="text-sm text-gray-300 mt-1">{shipment.cost}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-gray-300">{t('shipper.from')}</p>
                          <p className="text-sm font-medium">{shipment.pickup}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-300">{t('shipper.to')}</p>
                          <p className="text-sm font-medium">{shipment.delivery}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-gray-500" />
                          <h4 className="font-semibold text-white">{shipment.driver}</h4>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-complementary" />
                            <span className="text-xs text-white">{shipment.rating}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-300">
                          <Clock className="w-4 h-4 text-complementary" />
                          <span>ETA: {shipment.eta}</span>
                        </div>
                      </div>

                      <div className="bg-gray-900 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-300">Progress</span>
                          <span className="text-sm font-medium text-white">{shipment.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-complementary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${shipment.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-3">
                        <Button variant="outline" size="sm" className="flex-1 text-white border-gray-700">
                          {t('shipper.trackLive')}
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 text-white border-gray-700">
                          {t('shipper.contactDriver')}
                        </Button>
                        <Button variant="outline" size="sm" className="text-white border-gray-700">
                          {t('shipper.details')}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Available Drivers */}
            <Card className="bg-gray-800 border-gray-700 rounded-xl shadow-lg p-6">
              <CardHeader>
                <CardTitle className="text-xl text-white">{t('shipper.availableDrivers')}</CardTitle>
                <CardDescription>{t('shipper.topMatchedDrivers')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {matchedDrivers.map((driver) => (
                    <div key={driver.id} className="border border-gray-700 rounded-lg p-4 hover:border-complementary transition-colors duration-200">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center">
                            <Truck className="w-6 h-6 text-complementary" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-white">{driver.name}</h4>
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                              <Star className="w-3 h-3 text-complementary" />
                              <span>{driver.rating}</span>
                              <span>•</span>
                              <span>{driver.completedTrips} trips</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-complementary">{driver.rate}</div>
                          <div className="text-sm text-gray-300">Available in {driver.eta}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-gray-300">{t('shipper.vehicleType')}</p>
                          <p className="text-sm font-medium text-white">{driver.vehicleType}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-300">{t('shipper.capacity')}</p>
                          <p className="text-sm font-medium text-white">{driver.capacity}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-complementary" />
                          <span className="text-sm font-medium text-white">{driver.matchScore}% {t('shipper.match')}</span>
                        </div>
                        <Badge className="status-active">{t('shipper.available')}</Badge>
                      </div>

                      <div className="flex gap-2">
                        <Button className="logistics-button-primary flex-1">{t('shipper.bookDriver')}</Button>
                        <Button variant="outline" size="sm" className="text-white border-gray-700">{t('shipper.viewProfile')}</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Quick Stats & Actions */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <Card className="bg-gray-800 border-gray-700 rounded-xl shadow-lg p-6">
              <CardHeader>
                <CardTitle className="text-lg text-white">{t('shipper.recentActivity')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{t('shipper.deliveryCompleted')}</p>
                      <p className="text-xs text-gray-800">SHP-087 delivered to Denver, CO</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <Package className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{t('shipper.loadPickedUp')}</p>
                      <p className="text-xs text-gray-800">SHP-002 from Phoenix, AZ</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                    <Clock className="w-5 h-5 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{t('shipper.newDriverMatch')}</p>
                      <p className="text-xs text-gray-800">3 drivers available for LD-456</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gray-800 border-gray-700 rounded-xl shadow-lg p-6">
              <CardHeader>
                <CardTitle className="text-lg text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setLogisticsRequestDialogOpen(true)}
                  >
                    <Package className="w-4 h-4 mr-2" />
                    {t('logisticsRequest.title')}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setShowLoadForm(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {t('shipper.postEmergencyLoad')}
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Search className="w-4 h-4 mr-2" />
                    {t('shipper.searchAvailableDrivers')}
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <DollarSign className="w-4 h-4 mr-2" />
                    {t('shipper.viewBillingHistory')}
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Star className="w-4 h-4 mr-2" />
                    {t('shipper.rateRecentDrivers')}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Cost Savings */}
            <Card className="bg-gray-800 border-gray-700 rounded-xl shadow-lg p-6">
              <CardHeader>
                <CardTitle className="text-lg text-white">{t('shipper.costSavings')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-complementary mb-2">$4,280</div>
                  <p className="text-sm text-gray-300 mb-4">{t('shipper.savedThisMonth')}</p>
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-sm text-green-700">{t('shipper.averageSavings')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* 물류 요청 팝업 */}
      <Dialog open={logisticsRequestDialogOpen} onOpenChange={setLogisticsRequestDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{t('logisticsRequest.title')}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* 등록 폼 */}
            <Card className="bg-gray-50">
              <CardHeader>
                <CardTitle className="text-lg">{editLogisticsRequestId ? t('logisticsRequest.edit') : t('logisticsRequest.register')}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogisticsRequestSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="logistics-request-id">{t('logisticsRequest.id')}</Label>
                      <Input
                        id="logistics-request-id"
                        name="id"
                        value={logisticsRequestForm.id}
                        onChange={handleLogisticsRequestChange}
                        placeholder="예: 4001"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="logistics-request-shipper-id">{t('logisticsRequest.shipperId')}</Label>
                      <Input
                        id="logistics-request-shipper-id"
                        name="shipperId"
                        value={logisticsRequestForm.shipperId}
                        onChange={handleLogisticsRequestChange}
                        placeholder="예: 1001"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="logistics-request-cargo-type">{t('logisticsRequest.cargoType')}</Label>
                      <Input
                        id="logistics-request-cargo-type"
                        name="cargoType"
                        value={logisticsRequestForm.cargoType}
                        onChange={handleLogisticsRequestChange}
                        placeholder="예: 전자제품"
                      />
                    </div>
                    <div>
                      <Label htmlFor="logistics-request-weight">{t('logisticsRequest.weight')}</Label>
                      <Input
                        id="logistics-request-weight"
                        name="weight"
                        value={logisticsRequestForm.weight}
                        onChange={handleLogisticsRequestChange}
                        placeholder="예: 5000"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="logistics-request-start-location">{t('logisticsRequest.startLocation')}</Label>
                      <Input
                        id="logistics-request-start-location"
                        name="startLocation"
                        value={logisticsRequestForm.startLocation}
                        onChange={handleLogisticsRequestChange}
                        placeholder="예: 서울"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="logistics-request-end-location">{t('logisticsRequest.endLocation')}</Label>
                      <Input
                        id="logistics-request-end-location"
                        name="endLocation"
                        value={logisticsRequestForm.endLocation}
                        onChange={handleLogisticsRequestChange}
                        placeholder="예: 부산"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="logistics-request-start-time">{t('logisticsRequest.startTime')}</Label>
                      <Input
                        id="logistics-request-start-time"
                        name="startTime"
                        value={logisticsRequestForm.startTime}
                        onChange={handleLogisticsRequestChange}
                        placeholder="예: 2024-01-15 10:00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="logistics-request-end-time">{t('logisticsRequest.endTime')}</Label>
                      <Input
                        id="logistics-request-end-time"
                        name="endTime"
                        value={logisticsRequestForm.endTime}
                        onChange={handleLogisticsRequestChange}
                        placeholder="예: 2024-01-15 20:00"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="logistics-request-priority">{t('logisticsRequest.priority')}</Label>
                      <Select 
                        value={logisticsRequestForm.priority} 
                        onValueChange={(value) => setLogisticsRequestForm(prev => ({ ...prev, priority: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="우선순위 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="일반">일반</SelectItem>
                          <SelectItem value="긴급">긴급</SelectItem>
                          <SelectItem value="특급">특급</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="logistics-request-status">{t('logisticsRequest.status')}</Label>
                      <Select 
                        value={logisticsRequestForm.status} 
                        onValueChange={(value) => setLogisticsRequestForm(prev => ({ ...prev, status: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="상태 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="대기중">대기중</SelectItem>
                          <SelectItem value="진행중">진행중</SelectItem>
                          <SelectItem value="완료">완료</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button type="submit" className="logistics-button-primary">
                      {editLogisticsRequestId ? t('logisticsRequest.save') : t('logisticsRequest.register')}
                    </Button>
                    {editLogisticsRequestId && (
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => {
                          setLogisticsRequestForm({ id: '', shipperId: '', cargoType: '', startLocation: '', endLocation: '', startTime: '', endTime: '', weight: '', priority: '', status: '' });
                          setEditLogisticsRequestId(null);
                        }}
                      >
                        {t('logisticsRequest.cancel')}
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
            
            {/* 목록 테이블 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">물류 요청 목록</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('logisticsRequest.id')}</TableHead>
                      <TableHead>{t('logisticsRequest.shipperId')}</TableHead>
                      <TableHead>{t('logisticsRequest.cargoType')}</TableHead>
                      <TableHead>{t('logisticsRequest.startLocation')}</TableHead>
                      <TableHead>{t('logisticsRequest.endLocation')}</TableHead>
                      <TableHead>{t('logisticsRequest.startTime')}</TableHead>
                      <TableHead>{t('logisticsRequest.endTime')}</TableHead>
                      <TableHead>{t('logisticsRequest.weight')}</TableHead>
                      <TableHead>{t('logisticsRequest.priority')}</TableHead>
                      <TableHead>{t('logisticsRequest.status')}</TableHead>
                      <TableHead>{t('logisticsRequest.action')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logisticsRequests.map((logisticsRequest) => (
                      <TableRow key={logisticsRequest.id}>
                        <TableCell>{logisticsRequest.id}</TableCell>
                        <TableCell>{logisticsRequest.shipperId}</TableCell>
                        <TableCell>{logisticsRequest.cargoType}</TableCell>
                        <TableCell>{logisticsRequest.startLocation}</TableCell>
                        <TableCell>{logisticsRequest.endLocation}</TableCell>
                        <TableCell>{logisticsRequest.startTime}</TableCell>
                        <TableCell>{logisticsRequest.endTime}</TableCell>
                        <TableCell>{logisticsRequest.weight}</TableCell>
                        <TableCell>{logisticsRequest.priority}</TableCell>
                        <TableCell>{logisticsRequest.status}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleLogisticsRequestEdit(logisticsRequest)}
                            >
                              {t('logisticsRequest.edit')}
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleLogisticsRequestDelete(logisticsRequest.id)}
                            >
                              {t('logisticsRequest.delete')}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setLogisticsRequestDialogOpen(false)}
            >
              {t('logisticsRequest.cancel')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShipperDashboard;
