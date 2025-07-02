import React, { useState, useEffect } from 'react';
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
import {
  fetchCompanies, createCompany, updateCompany, deleteCompany,
  fetchVehicles, createVehicle, updateVehicle, deleteVehicle,
  fetchDrivers, createDriver, updateDriver, deleteDriver,
  fetchEmptyRuns, createEmptyRun, updateEmptyRun, deleteEmptyRun,
  fetchShippers, createShipper, updateShipper, deleteShipper
} from '../lib/api';
import { useToast } from '@/hooks/use-toast';

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
  const [companies, setCompanies] = React.useState([]);
  const [companyForm, setCompanyForm] = React.useState({
    company_id: '',
    company_name: '',
    business_number: '',
    phone: '',
    email: '',
    address: '',
    company_type: '',
    status: ''
  });
  const [editCompanyId, setEditCompanyId] = React.useState(null);

  const handleCompanyChange = e => {
    const { name, value } = e.target;
    setCompanyForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCompanySubmit = async e => {
    e.preventDefault();
    if (!companyForm.company_name) return;
    if (editCompanyId) {
      await updateCompany(editCompanyId, companyForm);
    } else {
      await createCompany(companyForm);
    }
    fetchCompanies().then(res => setCompanies(res.data));
    setCompanyForm({ company_id: '', company_name: '', business_number: '', phone: '', email: '', address: '', company_type: '', status: '' });
    setEditCompanyId(null);
  };

  const handleCompanyEdit = company => {
    setCompanyForm(company);
    setEditCompanyId(company.company_id);
  };

  const handleCompanyDelete = async id => {
    await deleteCompany(id);
    fetchCompanies().then(res => setCompanies(res.data));
  };

  const [vehicleDialogOpen, setVehicleDialogOpen] = React.useState(false);
  const [vehicles, setVehicles] = React.useState([]);
  const [vehicleForm, setVehicleForm] = React.useState({ id: '', number: '', type: '', weight: '', companyId: '', driverId: '', driver: '', driverContact: '' });
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

  const { toast } = useToast();

  // 최초 마운트 시 DB에서 차량 목록 불러오기
  React.useEffect(() => {
    fetchVehicles().then(res => {
      setVehicles(
        res.data.map(v => ({
          id: v.vehicle_id,
          number: v.license_plate,
          type: v.vehicle_type,
          weight: v.max_weight,
          companyId: Number(v.company_id),
          driverId: v.driver_id ? String(v.driver_id) : '',
          driver: '',
          driverContact: ''
        }))
      );
    });
  }, []);

  const handleVehicleSubmit = async e => {
    e.preventDefault();
    if (!vehicleForm.number) return;
    let old = vehicles.find(v => v.id === editVehicleId) || {};
    const dbPayload = {
      company_id: Number(vehicleForm.companyId) || null,
      license_plate: vehicleForm.number,
      vehicle_type: vehicleForm.type,
      max_weight: Number(vehicleForm.weight) || null,
      max_volume: editVehicleId ? (old.max_volume ?? 0) : 0,
      driver_id: Number(vehicleForm.driverId) || null,
      status: editVehicleId ? (old.status ?? 'AVAILABLE') : 'AVAILABLE',
      current_location_lat: editVehicleId ? (old.current_location_lat ?? null) : null,
      current_location_lng: editVehicleId ? (old.current_location_lng ?? null) : null,
    };
    try {
      if (editVehicleId) {
        await updateVehicle(editVehicleId, dbPayload);
      } else {
        await createVehicle(dbPayload);
      }
      fetchVehicles().then(res => {
        setVehicles(
          res.data.map(v => ({
            id: v.vehicle_id,
            number: v.license_plate,
            type: v.vehicle_type,
            weight: v.max_weight,
            companyId: Number(v.company_id),
            driverId: v.driver_id ? String(v.driver_id) : '',
            driver: '',
            driverContact: ''
          }))
        );
      });
      setVehicleForm({ id: '', number: '', type: '', weight: '', companyId: '', driverId: '', driver: '', driverContact: '' });
      setEditVehicleId(null);
    } catch (error) {
      // 에러 처리 (필요시)
    }
  };

  const handleVehicleEdit = vehicle => {
    setVehicleForm({
      ...vehicle,
      driverId: vehicle.driverId || '',
    });
    setEditVehicleId(vehicle.id);
  };

  const handleVehicleDelete = async id => {
    await deleteVehicle(id);
    fetchVehicles().then(res => {
      setVehicles(
        res.data.map(v => ({
          id: v.vehicle_id,
          number: v.license_plate,
          type: v.vehicle_type,
          weight: v.max_weight,
          companyId: Number(v.company_id),
          driverId: v.driver_id ? String(v.driver_id) : '',
          driver: '',
          driverContact: ''
        }))
      );
    });
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
  const handleDriverSubmit = async e => {
    e.preventDefault();
    if (!driverForm.name) return;
    if (editDriverId) {
      await updateDriver(editDriverId, driverForm);
    } else {
      await createDriver(driverForm);
    }
    fetchDrivers().then(res => setDrivers(res.data));
    setDriverForm({ name: '', contact: '', companyId: '', status: '' });
    setEditDriverId(null);
  };
  const handleDriverEdit = driver => {
    setDriverForm(driver);
    setEditDriverId(driver.id);
  };
  const handleDriverDelete = async id => {
    await deleteDriver(id);
    fetchDrivers().then(res => setDrivers(res.data));
  };

  // 공차 운행 등록 팝업 상태 및 핸들러
  const [emptyRunDialogOpen, setEmptyRunDialogOpen] = React.useState(false);
  const [emptyRuns, setEmptyRuns] = React.useState([
    { id: 3001, vehicleId: 2001, driverId: 1, companyId: 1001, startLocation: '서울', endLocation: '부산', startDate: '2024-01-15', startTime: '09:00', estimatedArrivalTime: '18:00', capacity: 3000, status: '예정' },
    { id: 3002, vehicleId: 2002, driverId: 2, companyId: 1002, startLocation: '대구', endLocation: '인천', startDate: '2024-01-16', startTime: '10:00', estimatedArrivalTime: '19:00', capacity: 2500, status: '진행중' },
    { id: 3003, vehicleId: 2003, driverId: 1, companyId: 1003, startLocation: '광주', endLocation: '대전', startDate: '2024-01-17', startTime: '08:00', estimatedArrivalTime: '17:00', capacity: 4000, status: '완료' }
  ]);
  const [emptyRunForm, setEmptyRunForm] = React.useState({ 
    id: '', vehicleId: '', driverId: '', companyId: '', startLocation: '', endLocation: '', 
    startDate: '', startTime: '', estimatedArrivalTime: '', capacity: '', status: '' 
  });
  const [editEmptyRunId, setEditEmptyRunId] = React.useState(null);

  const handleEmptyRunChange = e => {
    const { name, value } = e.target;
    if (name === 'id' || name === 'vehicleId' || name === 'driverId' || name === 'companyId' || name === 'capacity') {
      const onlyNums = value.replace(/[^0-9]/g, '');
      setEmptyRunForm(prev => ({ ...prev, [name]: onlyNums }));
    } else {
      setEmptyRunForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleEmptyRunSubmit = async e => {
    e.preventDefault();
    if (!emptyRunForm.vehicleId || !emptyRunForm.startLocation || !emptyRunForm.endLocation) return;
    if (editEmptyRunId) {
      await updateEmptyRun(editEmptyRunId, emptyRunForm);
    } else {
      await createEmptyRun(emptyRunForm);
    }
    fetchEmptyRuns().then(res => setEmptyRuns(res.data));
    setEmptyRunForm({ id: '', vehicleId: '', driverId: '', companyId: '', startLocation: '', endLocation: '', startDate: '', startTime: '', estimatedArrivalTime: '', capacity: '', status: '' });
    setEditEmptyRunId(null);
  };

  const handleEmptyRunEdit = emptyRun => {
    setEmptyRunForm({ ...emptyRun, id: String(emptyRun.id), vehicleId: String(emptyRun.vehicleId), driverId: emptyRun.driverId ? String(emptyRun.driverId) : '', companyId: emptyRun.companyId ? String(emptyRun.companyId) : '', capacity: String(emptyRun.capacity) });
    setEditEmptyRunId(emptyRun.id);
  };

  const handleEmptyRunDelete = async id => {
    await deleteEmptyRun(id);
    fetchEmptyRuns().then(res => setEmptyRuns(res.data));
  };

  // 물류 요청 팝업 상태 및 핸들러
  const [logisticsRequestDialogOpen, setLogisticsRequestDialogOpen] = React.useState(false);
  const [logisticsRequests, setLogisticsRequests] = React.useState([
    { id: 4001, shipperId: 1001, cargoType: '전자제품', startLocation: '서울', endLocation: '부산', startTime: '2024-01-15 10:00', endTime: '2024-01-15 20:00', weight: 5000, priority: '긴급', status: '대기중' },
    { id: 4002, shipperId: 1002, cargoType: '자동차부품', startLocation: '대구', endLocation: '인천', startTime: '2024-01-16 09:00', endTime: '2024-01-16 18:00', weight: 3000, priority: '일반', status: '진행중' },
    { id: 4003, shipperId: 1003, cargoType: '식품', startLocation: '광주', endLocation: '대전', startTime: '2024-01-17 08:00', endTime: '2024-01-17 17:00', weight: 2000, priority: '특급', status: '완료' }
  ]);
  const [logisticsRequestForm, setLogisticsRequestForm] = React.useState({ 
    id: '', shipperId: '', cargoType: '', startLocation: '', endLocation: '', 
    startTime: '', endTime: '', weight: '', priority: '', status: '' 
  });
  const [editLogisticsRequestId, setEditLogisticsRequestId] = React.useState(null);

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

  // 헬퍼 함수들
  const getCompanyName = (companyId) => {
    const company = companies.find(c => c.id === companyId);
    return company ? company.name : companyId;
  };

  const getVehicleNumber = (vehicleId) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? vehicle.number : vehicleId;
  };

  const getDriverName = (driverId) => {
    const driver = users.find(d => d.phone === driverId);
    return driver ? driver.name : driverId;
  };

  // 회사 관리 API 연동
  useEffect(() => {
    fetchCompanies().then(res => {
      if (res && Array.isArray(res.data)) setCompanies(res.data);
      else setCompanies([]);
    });
  }, []);

  // 공차 운행 관리 API 연동
  useEffect(() => {
    fetchEmptyRuns().then(res => setEmptyRuns(res.data));
  }, []);

  // 물류 요청(화주) 관리 API 연동
  const [shippers, setShippers] = React.useState([
    { id: 1001, name: '화주A', contact: '010-1111-1001', address: '서울시 강남구', etc: '주문 완료' },
    { id: 1002, name: '화주B', contact: '010-2222-2002', address: '인천시 연수구', etc: '배송 중' },
    { id: 1003, name: '화주C', contact: '010-3333-3003', address: '대구시 동구', etc: '배송 완료' },
    { id: 1004, name: '화주D', contact: '010-4444-4004', address: '광주시 남구', etc: '주문 중' },
    { id: 1005, name: '화주E', contact: '010-5555-5005', address: '부산시 해운대구', etc: '주문 완료' }
  ]);
  const [shipperForm, setShipperForm] = React.useState({ id: '', name: '', contact: '', address: '', etc: '' });
  const [editShipperId, setEditShipperId] = React.useState(null);

  const handleShipperChange = e => {
    const { name, value } = e.target;
    if (name === 'id' || name === 'contact') {
      // 숫자만 허용
      const onlyNums = value.replace(/[^0-9]/g, '');
      setShipperForm(prev => ({ ...prev, [name]: onlyNums }));
    } else {
      setShipperForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleShipperSubmit = async e => {
    e.preventDefault();
    if (!shipperForm.name) return;
    if (editShipperId) {
      await updateShipper(editShipperId, shipperForm);
    } else {
      await createShipper(shipperForm);
    }
    fetchShippers().then(res => setShippers(res.data));
    setShipperForm({ id: '', name: '', contact: '', address: '', etc: '' });
    setEditShipperId(null);
  };

  const handleShipperEdit = shipper => {
    setShipperForm(shipper);
    setEditShipperId(shipper.id);
  };

  const handleShipperDelete = async id => {
    await deleteShipper(id);
    fetchShippers().then(res => setShippers(res.data));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 p-6 text-foreground">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 relative">
          <div className="flex items-center justify-between">
            {/* 좌측: 홈버튼 */}
            <a href="/" className="flex items-center gap-4 min-w-[180px] cursor-pointer no-underline">
              <Logo />
            </a>
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
                {/* 4개 주요 버튼: 2열 그리드로 배치 */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start text-foreground border-border"
                    onClick={() => setCompanyDialogOpen(true)}
                  >
                    <Building className="w-4 h-4 mr-2 text-complementary" />
                    {t('admin.platformManagement.manageCompanies')}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-foreground border-border"
                    onClick={() => setVehicleDialogOpen(true)}
                  >
                    <Truck className="w-4 h-4 mr-2 text-complementary" />
                    {t('admin.platformManagement.manageVehicles')}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-foreground border-border"
                    onClick={() => setDriverDialogOpen(true)}
                  >
                    <User className="w-4 h-4 mr-2 text-complementary" />
                    {t('admin.platformManagement.manageDrivers')}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-foreground border-border"
                    onClick={() => setUserDialogOpen(true)}
                  >
                    <Users className="w-4 h-4 mr-2 text-complementary" />
                    {t('admin.platformManagement.manageUsers')}
                  </Button>
                </div>
                {/* 신규 버튼 2개: 한 줄에 하나씩 세로로 배치 */}
                <div className="space-y-3 mt-3">
                  {/* 물류 요청 버튼 완전 삭제 */}
                  <Button
                    variant="outline"
                    className="w-full justify-start text-foreground border-border"
                  >
                    <DollarSign className="w-4 h-4 mr-2 text-complementary" />
                    {t('admin.platformManagement.paymentSettings')}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-foreground border-border"
                  >
                    <BarChart3 className="w-4 h-4 mr-2 text-complementary" />
                    {t('admin.platformManagement.analyticsReports')}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-foreground border-border"
                  >
                    <AlertTriangle className="w-4 h-4 mr-2 text-complementary" />
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
        <DialogContent className="max-w-3xl w-full bg-[#0f1a2e] text-white">
          <DialogHeader>
            <DialogTitle className="text-white">{t('admin.platformManagement.manageUsers')}</DialogTitle>
          </DialogHeader>
          {/* CRID 예시 UI */}
          <div className="space-y-4 mt-4 overflow-x-auto">
            <form className="flex flex-wrap gap-2 min-w-[600px]" onSubmit={handleSubmit}>
              <input
                type="tel"
                className="flex-1 min-w-[120px] px-2 py-1 rounded border border-[#2d4a6b] bg-[#1a2a40] text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400"
                placeholder="전화번호"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                disabled={!!editPhone}
              />
              <input
                className="flex-1 min-w-[100px] px-2 py-1 rounded border border-[#2d4a6b] bg-[#1a2a40] text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400"
                placeholder="이름"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
              <input
                className="flex-1 min-w-[140px] px-2 py-1 rounded border border-[#2d4a6b] bg-[#1a2a40] text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400"
                placeholder="이메일"
                name="email"
                value={form.email}
                onChange={handleChange}
              />
              <select
                className="flex-1 min-w-[80px] px-2 py-1 rounded border border-[#2d4a6b] bg-[#1a2a40] text-white focus:ring-2 focus:ring-blue-400"
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
                  <TableRow key={user.phone} className="bg-[#1a2a40] border-[#2d4a6b]">
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

      <Dialog open={vehicleDialogOpen} onOpenChange={setVehicleDialogOpen}>
        <DialogContent className="max-w-6xl w-full bg-[#0f1a2e] text-white">
          <DialogHeader>
            <DialogTitle className="text-white">{t('admin.platformManagement.manageVehicles')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4 overflow-x-auto">
            <form className="flex flex-wrap gap-2 min-w-[900px]" onSubmit={handleVehicleSubmit}>
              <select
                className="flex-1 min-w-[120px] px-2 py-1 rounded border border-[#2d4a6b] bg-[#1a2a40] text-white focus:ring-2 focus:ring-blue-400"
                name="companyId"
                value={vehicleForm.companyId || ''}
                onChange={e => setVehicleForm(prev => ({ ...prev, companyId: e.target.value }))}
                required
              >
                <option value="">소유회사 선택</option>
                {companies.map((c) => (
                  <option key={c.company_id} value={c.company_id}>{c.company_name}</option>
                ))}
              </select>
              <input
                className="flex-1 min-w-[120px] px-2 py-1 rounded border border-[#2d4a6b] bg-[#1a2a40] text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400"
                placeholder="차량번호"
                name="number"
                value={vehicleForm.number}
                onChange={handleVehicleChange}
                required
              />
              <select
                className="flex-1 min-w-[100px] px-2 py-1 rounded border border-[#2d4a6b] bg-[#1a2a40] text-white focus:ring-2 focus:ring-blue-400"
                name="type"
                value={vehicleForm.type}
                onChange={handleVehicleChange}
                required
              >
                <option value="">차종 선택</option>
                <option value="트럭">트럭</option>
                <option value="탑차">탑차</option>
                <option value="윙바디">윙바디</option>
                <option value="냉동탑차">냉동탑차</option>
                <option value="트레일러">트레일러</option>
                <option value="기타">기타</option>
              </select>
              <input
                type="tel"
                className="flex-1 min-w-[100px] px-2 py-1 rounded border border-[#2d4a6b] bg-[#1a2a40] text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400"
                placeholder="적재중량(kg)"
                name="weight"
                value={vehicleForm.weight}
                onChange={handleVehicleChange}
              />
              <select
                className="flex-1 min-w-[120px] px-2 py-1 rounded border border-[#2d4a6b] bg-[#1a2a40] text-white focus:ring-2 focus:ring-blue-400"
                name="driverId"
                value={vehicleForm.driverId || ''}
                onChange={e => setVehicleForm(prev => ({ ...prev, driverId: e.target.value }))}
                required
              >
                <option value="">운전자 선택</option>
                {drivers.filter(d => String(d.companyId) === String(vehicleForm.companyId)).map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
              <input
                className="flex-1 min-w-[120px] px-2 py-1 rounded border border-[#2d4a6b] bg-[#1a2a40] text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400"
                placeholder="운전자 연락처"
                name="driverContact"
                value={drivers.find(d => String(d.id) === String(vehicleForm.driverId))?.contact || ''}
                readOnly
              />
              <Button type="submit" className={`bg-blue-600 hover:bg-blue-700 text-white font-bold`}>
                {editVehicleId ? '저장' : '등록'}
              </Button>
              {editVehicleId && (
                <Button type="button" variant="outline" className="border-gray-400 text-gray-200" onClick={() => { setVehicleForm({ id: '', number: '', type: '', weight: '', companyId: '', driverId: '', driver: '', driverContact: '' }); setEditVehicleId(null); }}>취소</Button>
              )}
            </form>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-white">소유회사</TableHead>
                  <TableHead className="text-white">차량번호</TableHead>
                  <TableHead className="text-white">차종</TableHead>
                  <TableHead className="text-white">적재중량(kg)</TableHead>
                  <TableHead className="text-white">운전자명</TableHead>
                  <TableHead className="text-white">운전자 연락처</TableHead>
                  <TableHead className="text-white"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicles.map((vehicle) => {
                  const company = companies.find(c => Number(c.company_id) === Number(vehicle.companyId));
                  return (
                    <TableRow key={vehicle.id} className="bg-[#1a2a40] border-[#2d4a6b]">
                      <TableCell className="text-white">{company ? company.company_name : '-'}</TableCell>
                      <TableCell className="text-white">{vehicle.number}</TableCell>
                      <TableCell className="text-white">{vehicle.type}</TableCell>
                      <TableCell className="text-white">{vehicle.weight}</TableCell>
                      <TableCell className="text-white">
                        {(() => {
                          const driver = drivers.find(d => String(d.id) === String(vehicle.driverId));
                          return driver ? driver.name : '';
                        })()}
                      </TableCell>
                      <TableCell className="text-white">
                        {(() => {
                          const driver = drivers.find(d => String(d.id) === String(vehicle.driverId));
                          return driver ? driver.contact : '';
                        })()}
                      </TableCell>
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
        <DialogContent className="max-w-3xl w-full bg-[#0f1a2e] text-white">
          <DialogHeader>
            <DialogTitle className="text-white">{t('admin.platformManagement.manageDrivers')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4 overflow-x-auto">
            <form className="flex flex-wrap gap-2 min-w-[600px]" onSubmit={handleDriverSubmit}>
              <select
                className="flex-1 min-w-[120px] px-2 py-1 rounded border border-[#2d4a6b] bg-[#1a2a40] text-white focus:ring-2 focus:ring-blue-400"
                name="companyId"
                value={driverForm.companyId}
                onChange={handleDriverChange}
                required
              >
                <option value="">회사명 선택</option>
                {companies.map((c) => (
                  <option key={c.company_id} value={c.company_id}>{c.company_name}</option>
                ))}
              </select>
              <input
                className="flex-1 min-w-[120px] px-2 py-1 rounded border border-[#2d4a6b] bg-[#1a2a40] text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400"
                placeholder="운전자명"
                name="name"
                value={driverForm.name}
                onChange={handleDriverChange}
                required
              />
              <input
                type="tel"
                className="flex-1 min-w-[140px] px-2 py-1 rounded border border-[#2d4a6b] bg-[#1a2a40] text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400"
                placeholder="연락처"
                name="contact"
                value={driverForm.contact}
                onChange={handleDriverChange}
                required
              />
              <select
                className="flex-1 min-w-[100px] px-2 py-1 rounded border border-[#2d4a6b] bg-[#1a2a40] text-white focus:ring-2 focus:ring-blue-400"
                name="status"
                value={driverForm.status}
                onChange={handleDriverChange}
                required
              >
                <option value="">상태 선택</option>
                <option value="재직">재직</option>
                <option value="휴직">휴직</option>
                <option value="퇴사">퇴사</option>
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
                  <TableHead className="text-white">회사명</TableHead>
                  <TableHead className="text-white">운전자명</TableHead>
                  <TableHead className="text-white">연락처</TableHead>
                  <TableHead className="text-white">상태</TableHead>
                  <TableHead className="text-white"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {drivers.map((driver) => {
                  const company = companies.find(c => String(c.company_id) === String(driver.companyId));
                  return (
                    <TableRow key={driver.id} className="bg-[#1a2a40] border-[#2d4a6b]">
                      <TableCell className="text-white">{company ? company.company_name : '-'}</TableCell>
                      <TableCell className="text-white">{driver.name}</TableCell>
                      <TableCell className="text-white">{driver.contact}</TableCell>
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

      {/* 공차 운행 등록 팝업 */}
      <Dialog open={emptyRunDialogOpen} onOpenChange={setEmptyRunDialogOpen}>
        <DialogContent className="max-w-6xl w-full bg-[#0f1a2e] text-white">
          <DialogHeader>
            <DialogTitle className="text-foreground text-2xl font-bold">{t('emptyRun.title')}</DialogTitle>
            <p className="text-muted-foreground text-base leading-relaxed">{t('emptyRun.description')}</p>
          </DialogHeader>
          <div className="space-y-4 mt-4 overflow-x-auto">
            <form className="flex flex-wrap gap-2 min-w-[1200px]" onSubmit={handleEmptyRunSubmit}>
              <input
                className="flex-1 min-w-[80px] px-2 py-1 rounded border border-[#2d4a6b] bg-[#1a2a40] text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400"
                placeholder={t('emptyRun.id')}
                name="id"
                value={emptyRunForm.id}
                onChange={handleEmptyRunChange}
                required
                disabled={!!editEmptyRunId}
              />
              <select
                className="flex-1 min-w-[120px] px-2 py-1 rounded border border-[#2d4a6b] bg-[#1a2a40] text-white focus:ring-2 focus:ring-blue-400"
                name="companyId"
                value={emptyRunForm.companyId}
                onChange={handleEmptyRunChange}
                required
              >
                <option value="">회사 선택</option>
                {companies.map((company) => (
                  <option key={company.company_id} value={company.company_id}>{company.company_name}</option>
                ))}
              </select>
              <select
                className="flex-1 min-w-[120px] px-2 py-1 rounded border border-[#2d4a6b] bg-[#1a2a40] text-white focus:ring-2 focus:ring-blue-400"
                name="driverId"
                value={emptyRunForm.driverId}
                onChange={handleEmptyRunChange}
                required
              >
                <option value="">운전자 선택</option>
                {drivers.map((driver) => (
                  <option key={driver.id} value={driver.id}>{driver.name}</option>
                ))}
              </select>
              <input
                className="flex-1 min-w-[120px] px-2 py-1 rounded border border-[#2d4a6b] bg-[#1a2a40] text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400"
                placeholder={t('emptyRun.startLocation')}
                name="startLocation"
                value={emptyRunForm.startLocation}
                onChange={handleEmptyRunChange}
                required
              />
              <input
                className="flex-1 min-w-[120px] px-2 py-1 rounded border border-[#2d4a6b] bg-[#1a2a40] text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400"
                placeholder={t('emptyRun.endLocation')}
                name="endLocation"
                value={emptyRunForm.endLocation}
                onChange={handleEmptyRunChange}
                required
              />
              <input
                type="date"
                className="flex-1 min-w-[140px] px-2 py-1 rounded border border-[#2d4a6b] bg-[#1a2a40] text-white focus:ring-2 focus:ring-blue-400"
                name="startDate"
                value={emptyRunForm.startDate}
                onChange={handleEmptyRunChange}
                required
              />
              <input
                type="time"
                className="flex-1 min-w-[100px] px-2 py-1 rounded border border-[#2d4a6b] bg-[#1a2a40] text-white focus:ring-2 focus:ring-blue-400"
                name="startTime"
                value={emptyRunForm.startTime}
                onChange={handleEmptyRunChange}
                required
              />
              <input
                type="time"
                className="flex-1 min-w-[100px] px-2 py-1 rounded border border-[#2d4a6b] bg-[#1a2a40] text-white focus:ring-2 focus:ring-blue-400"
                name="estimatedArrivalTime"
                value={emptyRunForm.estimatedArrivalTime}
                onChange={handleEmptyRunChange}
                required
              />
              <input
                className="flex-1 min-w-[100px] px-2 py-1 rounded border border-[#2d4a6b] bg-[#1a2a40] text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400"
                placeholder={t('emptyRun.capacity')}
                name="capacity"
                value={emptyRunForm.capacity}
                onChange={handleEmptyRunChange}
                required
              />
              <select
                className="flex-1 min-w-[100px] px-2 py-1 rounded border border-[#2d4a6b] bg-[#1a2a40] text-white focus:ring-2 focus:ring-blue-400"
                name="status"
                value={emptyRunForm.status}
                onChange={handleEmptyRunChange}
                required
              >
                <option value="">{t('emptyRun.status')}</option>
                <option value="예정">예정</option>
                <option value="진행중">진행중</option>
                <option value="완료">완료</option>
                <option value="취소">취소</option>
              </select>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-base px-6 py-2">
                {editEmptyRunId ? t('emptyRun.save') : t('emptyRun.register')}
              </Button>
              {editEmptyRunId && (
                <Button 
                  type="button" 
                  variant="outline" 
                  className="border-gray-400 text-gray-200 font-semibold text-base px-6 py-2" 
                  onClick={() => { 
                    setEmptyRunForm({ id: '', vehicleId: '', driverId: '', companyId: '', startLocation: '', endLocation: '', startDate: '', startTime: '', estimatedArrivalTime: '', capacity: '', status: '' }); 
                    setEditEmptyRunId(null); 
                  }}
                >
                  {t('emptyRun.cancel')}
                </Button>
              )}
            </form>
            <Table className="min-w-[1200px] w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-white font-semibold text-base">{t('emptyRun.id')}</TableHead>
                  <TableHead className="text-white font-semibold text-base">회사명</TableHead>
                  <TableHead className="text-white font-semibold text-base">차량번호</TableHead>
                  <TableHead className="text-white font-semibold text-base">운전자명</TableHead>
                  <TableHead className="text-white font-semibold text-base">{t('emptyRun.startLocation')}</TableHead>
                  <TableHead className="text-white font-semibold text-base">{t('emptyRun.endLocation')}</TableHead>
                  <TableHead className="text-white font-semibold text-base">출발일자</TableHead>
                  <TableHead className="text-white font-semibold text-base">출발시각</TableHead>
                  <TableHead className="text-white font-semibold text-base">도착예정시각</TableHead>
                  <TableHead className="text-white font-semibold text-base">{t('emptyRun.capacity')}</TableHead>
                  <TableHead className="text-white font-semibold text-base">{t('emptyRun.status')}</TableHead>
                  <TableHead className="text-white font-semibold text-base">{t('emptyRun.action')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {emptyRuns.map((emptyRun) => (
                  <TableRow key={emptyRun.id} className="bg-[#1a2a40] border-[#2d4a6b]">
                    <TableCell className="text-white text-base">{emptyRun.id}</TableCell>
                    <TableCell className="text-white text-base">{companies.find(c => c.company_id === Number(emptyRun.companyId))?.company_name || '-'}</TableCell>
                    <TableCell className="text-white text-base">{getVehicleNumber(emptyRun.vehicleId)}</TableCell>
                    <TableCell className="text-white text-base">{drivers.find(d => d.id === Number(emptyRun.driverId))?.name || '-'}</TableCell>
                    <TableCell className="text-white text-base">{emptyRun.startLocation}</TableCell>
                    <TableCell className="text-white text-base">{emptyRun.endLocation}</TableCell>
                    <TableCell className="text-white text-base">{emptyRun.startDate?.replace('T', ' ')}</TableCell>
                    <TableCell className="text-white text-base">{emptyRun.startTime?.replace('T', ' ')}</TableCell>
                    <TableCell className="text-white text-base">{emptyRun.estimatedArrivalTime?.replace('T', ' ')}</TableCell>
                    <TableCell className="text-white text-base">{emptyRun.capacity}</TableCell>
                    <TableCell className="text-white text-base">{emptyRun.status}</TableCell>
                    <TableCell>
                      <Button 
                        size="sm" 
                        className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold mr-2 font-semibold" 
                        onClick={() => handleEmptyRunEdit(emptyRun)}
                      >
                        {t('emptyRun.edit')}
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-red-600 hover:bg-red-700 text-white font-bold font-semibold" 
                        onClick={() => handleEmptyRunDelete(emptyRun.id)}
                      >
                        {t('emptyRun.delete')}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <Button variant="outline" className="border-gray-400 text-gray-200 font-semibold text-base px-6 py-2" onClick={() => setEmptyRunDialogOpen(false)}>
              {t('emptyRun.cancel')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 물류 요청 팝업 */}
      <Dialog open={logisticsRequestDialogOpen} onOpenChange={setLogisticsRequestDialogOpen}>
        <DialogContent className="max-w-6xl w-full bg-[#0f1a2e] text-white">
          <DialogHeader>
            <DialogTitle className="text-white">{t('logisticsRequest.title')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4 overflow-x-auto">
            <form className="flex flex-wrap gap-2 min-w-[1200px]" onSubmit={handleLogisticsRequestSubmit}>
              <input
                className="flex-1 min-w-[80px] px-2 py-1 rounded border border-[#2d4a6b] bg-[#1a2a40] text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400"
                placeholder={t('logisticsRequest.id')}
                name="id"
                value={logisticsRequestForm.id}
                onChange={handleLogisticsRequestChange}
                required
                disabled={!!editLogisticsRequestId}
              />
              <input
                className="flex-1 min-w-[80px] px-2 py-1 rounded border border-[#2d4a6b] bg-[#1a2a40] text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400"
                placeholder={t('logisticsRequest.shipperId')}
                name="shipperId"
                value={logisticsRequestForm.shipperId}
                onChange={handleLogisticsRequestChange}
                required
              />
              <select
                className="flex-1 min-w-[120px] px-2 py-1 rounded border border-[#2d4a6b] bg-[#1a2a40] text-white focus:ring-2 focus:ring-blue-400"
                name="cargoType"
                value={logisticsRequestForm.cargoType}
                onChange={handleLogisticsRequestChange}
                required
              >
                <option value="">{t('logisticsRequest.cargoType')}</option>
                <option value="전자제품">전자제품</option>
                <option value="자동차부품">자동차부품</option>
                <option value="식품">식품</option>
                <option value="가구">가구</option>
                <option value="의류">의류</option>
                <option value="기타">기타</option>
              </select>
              <input
                className="flex-1 min-w-[120px] px-2 py-1 rounded border border-[#2d4a6b] bg-[#1a2a40] text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400"
                placeholder={t('logisticsRequest.startLocation')}
                name="startLocation"
                value={logisticsRequestForm.startLocation}
                onChange={handleLogisticsRequestChange}
                required
              />
              <input
                className="flex-1 min-w-[120px] px-2 py-1 rounded border border-[#2d4a6b] bg-[#1a2a40] text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400"
                placeholder={t('logisticsRequest.endLocation')}
                name="endLocation"
                value={logisticsRequestForm.endLocation}
                onChange={handleLogisticsRequestChange}
                required
              />
              <input
                type="datetime-local"
                className="flex-1 min-w-[180px] px-2 py-1 rounded border border-[#2d4a6b] bg-[#1a2a40] text-white focus:ring-2 focus:ring-blue-400"
                name="startTime"
                value={logisticsRequestForm.startTime}
                onChange={handleLogisticsRequestChange}
                required
              />
              <input
                type="datetime-local"
                className="flex-1 min-w-[180px] px-2 py-1 rounded border border-[#2d4a6b] bg-[#1a2a40] text-white focus:ring-2 focus:ring-blue-400"
                name="endTime"
                value={logisticsRequestForm.endTime}
                onChange={handleLogisticsRequestChange}
                required
              />
              <input
                className="flex-1 min-w-[100px] px-2 py-1 rounded border border-[#2d4a6b] bg-[#1a2a40] text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400"
                placeholder={t('logisticsRequest.weight')}
                name="weight"
                value={logisticsRequestForm.weight}
                onChange={handleLogisticsRequestChange}
                required
              />
              <select
                className="flex-1 min-w-[100px] px-2 py-1 rounded border border-[#2d4a6b] bg-[#1a2a40] text-white focus:ring-2 focus:ring-blue-400"
                name="priority"
                value={logisticsRequestForm.priority}
                onChange={handleLogisticsRequestChange}
                required
              >
                <option value="">{t('logisticsRequest.priority')}</option>
                <option value="일반">일반</option>
                <option value="긴급">긴급</option>
                <option value="특급">특급</option>
              </select>
              <select
                className="flex-1 min-w-[100px] px-2 py-1 rounded border border-[#2d4a6b] bg-[#1a2a40] text-white focus:ring-2 focus:ring-blue-400"
                name="status"
                value={logisticsRequestForm.status}
                onChange={handleLogisticsRequestChange}
                required
              >
                <option value="">{t('logisticsRequest.status')}</option>
                <option value="대기중">대기중</option>
                <option value="진행중">진행중</option>
                <option value="완료">완료</option>
                <option value="취소">취소</option>
              </select>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
                {editLogisticsRequestId ? t('logisticsRequest.save') : t('logisticsRequest.register')}
              </Button>
              {editLogisticsRequestId && (
                <Button 
                  type="button" 
                  variant="outline" 
                  className="border-gray-400 text-gray-200" 
                  onClick={() => { 
                    setLogisticsRequestForm({ id: '', shipperId: '', cargoType: '', startLocation: '', endLocation: '', startTime: '', endTime: '', weight: '', priority: '', status: '' }); 
                    setEditLogisticsRequestId(null); 
                  }}
                >
                  {t('logisticsRequest.cancel')}
                </Button>
              )}
            </form>
            <Table className="min-w-[1200px] w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-white">{t('logisticsRequest.id')}</TableHead>
                  <TableHead className="text-white">{t('logisticsRequest.shipperId')}</TableHead>
                  <TableHead className="text-white">{t('logisticsRequest.cargoType')}</TableHead>
                  <TableHead className="text-white">{t('logisticsRequest.startLocation')}</TableHead>
                  <TableHead className="text-white">{t('logisticsRequest.endLocation')}</TableHead>
                  <TableHead className="text-white">{t('logisticsRequest.startTime')}</TableHead>
                  <TableHead className="text-white">{t('logisticsRequest.endTime')}</TableHead>
                  <TableHead className="text-white">{t('logisticsRequest.weight')}</TableHead>
                  <TableHead className="text-white">{t('logisticsRequest.priority')}</TableHead>
                  <TableHead className="text-white">{t('logisticsRequest.status')}</TableHead>
                  <TableHead className="text-white">{t('logisticsRequest.action')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logisticsRequests.map((logisticsRequest) => (
                  <TableRow key={logisticsRequest.id} className="bg-[#1a2a40] border-[#2d4a6b]">
                    <TableCell className="text-white">{logisticsRequest.id}</TableCell>
                    <TableCell className="text-white">{logisticsRequest.shipperId}</TableCell>
                    <TableCell className="text-white">{logisticsRequest.cargoType}</TableCell>
                    <TableCell className="text-white">{logisticsRequest.startLocation}</TableCell>
                    <TableCell className="text-white">{logisticsRequest.endLocation}</TableCell>
                    <TableCell className="text-white">{logisticsRequest.startTime?.replace('T', ' ')}</TableCell>
                    <TableCell className="text-white">{logisticsRequest.endTime?.replace('T', ' ')}</TableCell>
                    <TableCell className="text-white">{logisticsRequest.weight}</TableCell>
                    <TableCell className="text-white">{logisticsRequest.priority}</TableCell>
                    <TableCell className="text-white">{logisticsRequest.status}</TableCell>
                    <TableCell>
                      <Button 
                        size="sm" 
                        className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold mr-2" 
                        onClick={() => handleLogisticsRequestEdit(logisticsRequest)}
                      >
                        {t('logisticsRequest.edit')}
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-red-600 hover:bg-red-700 text-white font-bold" 
                        onClick={() => handleLogisticsRequestDelete(logisticsRequest.id)}
                      >
                        {t('logisticsRequest.delete')}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <Button variant="outline" className="border-gray-400 text-gray-200" onClick={() => setLogisticsRequestDialogOpen(false)}>
              {t('logisticsRequest.cancel')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={tripDialogOpen} onOpenChange={setTripDialogOpen}>
        <DialogContent className="max-w-6xl w-full bg-[#0f1a2e] text-white">
          <DialogHeader>
            <DialogTitle className="text-white">{t('admin.platformManagement.manageTrips') || '차량운행 내역 관리'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4 overflow-x-auto">
            <form className="flex flex-wrap gap-2 min-w-[900px]" onSubmit={handleTripSubmit}>
              <select
                className="flex-1 min-w-[120px] px-2 py-1 rounded border border-[#2d4a6b] bg-[#1a2a40] text-white focus:ring-2 focus:ring-blue-400"
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
                className="flex-1 min-w-[120px] px-2 py-1 rounded border border-[#2d4a6b] bg-[#1a2a40] text-white focus:ring-2 focus:ring-blue-400"
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
              <input className="flex-1 min-w-[120px] px-2 py-1 rounded border border-[#2d4a6b] bg-[#1a2a40] text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400" placeholder="출발지" name="departure" value={tripForm.departure} onChange={handleTripChange} required />
              <input className="flex-1 min-w-[120px] px-2 py-1 rounded border border-[#2d4a6b] bg-[#1a2a40] text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400" placeholder="도착지" name="arrival" value={tripForm.arrival} onChange={handleTripChange} required />
              <input type="datetime-local" className="flex-1 min-w-[180px] px-2 py-1 rounded border border-[#2d4a6b] bg-[#1a2a40] text-white focus:ring-2 focus:ring-blue-400" name="departureTime" value={tripForm.departureTime} onChange={handleTripChange} />
              <input type="datetime-local" className="flex-1 min-w-[180px] px-2 py-1 rounded border border-[#2d4a6b] bg-[#1a2a40] text-white focus:ring-2 focus:ring-blue-400" name="arrivalTime" value={tripForm.arrivalTime} onChange={handleTripChange} />
              <select className="flex-1 min-w-[100px] px-2 py-1 rounded border border-[#2d4a6b] bg-[#1a2a40] text-white focus:ring-2 focus:ring-blue-400" name="status" value={tripForm.status} onChange={handleTripChange}>
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
                    <TableRow key={trip.id} className="bg-[#1a2a40] border-[#2d4a6b]">
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
            <Button variant="outline" className="border-gray-400 text-gray-200" onClick={() => setTripDialogOpen(false)}>
              {t('shipper.cancel')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 회사 관리 팝업 */}
      <Dialog open={companyDialogOpen} onOpenChange={setCompanyDialogOpen}>
        <DialogContent className="max-w-6xl w-full bg-[#102040] text-white">
          <DialogHeader>
            <DialogTitle className="text-white">회사 관리</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4 overflow-x-auto">
            <form className="flex flex-wrap gap-2 min-w-[900px]" onSubmit={handleCompanySubmit}>
              <input name="company_name" placeholder="회사명" value={companyForm.company_name} onChange={handleCompanyChange} required className="flex-1 min-w-[120px] px-2 py-1 rounded border border-blue-900 bg-[#1a2a40] text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400" />
              <input name="business_number" placeholder="사업자번호" value={companyForm.business_number} onChange={handleCompanyChange} required className="flex-1 min-w-[120px] px-2 py-1 rounded border border-blue-900 bg-[#1a2a40] text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400" />
              <input name="phone" placeholder="대표전화" value={companyForm.phone} onChange={handleCompanyChange} required className="flex-1 min-w-[120px] px-2 py-1 rounded border border-blue-900 bg-[#1a2a40] text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400" />
              <input name="email" placeholder="이메일" value={companyForm.email} onChange={handleCompanyChange} className="flex-1 min-w-[120px] px-2 py-1 rounded border border-blue-900 bg-[#1a2a40] text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400" />
              <input name="address" placeholder="주소" value={companyForm.address} onChange={handleCompanyChange} className="flex-1 min-w-[120px] px-2 py-1 rounded border border-blue-900 bg-[#1a2a40] text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400" />
              <select name="company_type" value={companyForm.company_type} onChange={handleCompanyChange} required className="flex-1 min-w-[120px] px-2 py-1 rounded border border-blue-900 bg-[#1a2a40] text-white focus:ring-2 focus:ring-blue-400">
                <option value="">회사 유형</option>
                <option value="LOGISTICS">운송업</option>
                <option value="CARGO_OWNER">화주</option>
                <option value="ETC">기타</option>
              </select>
              <select name="status" value={companyForm.status} onChange={handleCompanyChange} required className="flex-1 min-w-[120px] px-2 py-1 rounded border border-blue-900 bg-[#1a2a40] text-white focus:ring-2 focus:ring-blue-400">
                <option value="">상태</option>
                <option value="ACTIVE">활성</option>
                <option value="INACTIVE">비활성</option>
              </select>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
                {editCompanyId ? '저장' : '등록'}
              </Button>
              {editCompanyId && (
                <Button type="button" variant="outline" className="bg-gray-600 border-gray-400 text-gray-200" onClick={() => { setCompanyForm({ company_id: '', company_name: '', business_number: '', phone: '', email: '', address: '', company_type: '', status: '' }); setEditCompanyId(null); }}>취소</Button>
              )}
            </form>
            <div className="w-full overflow-x-auto">
              <Table className="min-w-[1200px] w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-white">회사명</TableHead>
                    <TableHead className="text-white">사업자번호</TableHead>
                    <TableHead className="text-white">대표전화</TableHead>
                    <TableHead className="text-white">이메일</TableHead>
                    <TableHead className="text-white">주소</TableHead>
                    <TableHead className="text-white">회사 유형</TableHead>
                    <TableHead className="text-white">상태</TableHead>
                    <TableHead className="text-white">액션</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(companies || []).map((company) => (
                    <TableRow key={company.company_id} className="bg-[#1a2a40] border-[#2d4a6b]">
                      <TableCell className="text-white">{company.company_name}</TableCell>
                      <TableCell className="text-white">{company.business_number}</TableCell>
                      <TableCell className="text-white">{company.phone}</TableCell>
                      <TableCell className="text-white">{company.email}</TableCell>
                      <TableCell className="text-white">{company.address}</TableCell>
                      <TableCell className="text-white">{company.company_type}</TableCell>
                      <TableCell className="text-white">{company.status}</TableCell>
                      <TableCell>
                        <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold mr-2" onClick={() => handleCompanyEdit(company)}>수정</Button>
                        <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white font-bold" onClick={() => handleCompanyDelete(company.company_id)}>삭제</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="bg-gray-600 border-gray-400 text-gray-200" onClick={() => setCompanyDialogOpen(false)}>취소</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPage;
