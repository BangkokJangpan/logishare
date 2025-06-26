
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Truck, 
  Package, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Phone,
  MessageSquare,
  Navigation
} from 'lucide-react';

const TrackingPage = () => {
  const [trackingId, setTrackingId] = useState('SHP-001');
  
  const shipmentData = {
    id: 'SHP-001',
    cargo: 'Electronics Shipment',
    status: 'in-transit',
    progress: 65,
    driver: {
      name: 'John Smith',
      rating: 4.9,
      phone: '+1 (555) 123-4567',
      vehicle: '2022 Freightliner'
    },
    route: {
      pickup: { city: 'Los Angeles, CA', address: '1234 Industrial Blvd', time: '08:30 AM' },
      delivery: { city: 'Phoenix, AZ', address: '5678 Commerce Dr', time: '6:30 PM (Est.)' },
      distance: '387 miles',
      currentLocation: 'Approaching Riverside, CA'
    },
    timeline: [
      { status: 'Load Posted', time: '2024-01-15 06:00 AM', completed: true },
      { status: 'Driver Assigned', time: '2024-01-15 07:15 AM', completed: true },
      { status: 'Pickup Completed', time: '2024-01-15 08:30 AM', completed: true },
      { status: 'In Transit', time: '2024-01-15 09:00 AM', completed: true, current: true },
      { status: 'Delivery Scheduled', time: '2024-01-15 6:30 PM', completed: false },
      { status: 'Delivered', time: 'Pending', completed: false }
    ],
    eta: '4h 32m',
    lastUpdate: '2 minutes ago'
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-logistics-dark mb-4">Real-Time Tracking</h1>
          
          {/* Tracking Input */}
          <Card className="logistics-card">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <Input
                  placeholder="Enter tracking ID (e.g., SHP-001)"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  className="flex-1"
                />
                <Button className="logistics-button-primary">
                  Track Shipment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tracking Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Map & Location */}
          <div className="lg:col-span-2 space-y-6">
            {/* Live Map */}
            <Card className="logistics-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Live Location</CardTitle>
                    <CardDescription>Real-time GPS tracking</CardDescription>
                  </div>
                  <Badge className="status-active">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    Live
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {/* Map Placeholder */}
                <div className="h-80 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <MapPin className="w-16 h-16 text-logistics-primary mx-auto mb-4" />
                    <p className="text-lg font-semibold text-logistics-dark">Interactive Map View</p>
                    <p className="text-gray-600">Real-time vehicle location and route visualization</p>
                    <div className="mt-4 p-4 bg-white rounded-lg shadow-sm inline-block">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-3 h-3 bg-logistics-primary rounded-full"></div>
                        <span>Current Location: {shipmentData.route.currentLocation}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Route Summary */}
                <div className="grid grid-cols-2 gap-6 mt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Pickup Location</p>
                      <p className="font-semibold text-logistics-dark">{shipmentData.route.pickup.city}</p>
                      <p className="text-sm text-gray-500">{shipmentData.route.pickup.address}</p>
                      <p className="text-xs text-green-600">Completed at {shipmentData.route.pickup.time}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Delivery Location</p>
                      <p className="font-semibold text-logistics-dark">{shipmentData.route.delivery.city}</p>
                      <p className="text-sm text-gray-500">{shipmentData.route.delivery.address}</p>
                      <p className="text-xs text-orange-600">ETA: {shipmentData.route.delivery.time}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipment Progress */}
            <Card className="logistics-card">
              <CardHeader>
                <CardTitle className="text-xl">Shipment Progress</CardTitle>
                <CardDescription>Delivery timeline and status updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {shipmentData.timeline.map((step, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step.completed 
                          ? 'bg-logistics-primary text-white' 
                          : 'bg-gray-200 text-gray-500'
                      } ${step.current ? 'ring-4 ring-logistics-primary/20' : ''}`}>
                        {step.completed ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <div className="w-2 h-2 bg-current rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className={`font-medium ${
                            step.completed ? 'text-logistics-dark' : 'text-gray-500'
                          }`}>
                            {step.status}
                          </p>
                          <p className="text-sm text-gray-500">{step.time}</p>
                        </div>
                        {step.current && (
                          <p className="text-sm text-logistics-primary font-medium">Currently in progress</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Shipment Details */}
          <div className="space-y-6">
            {/* Shipment Info */}
            <Card className="logistics-card">
              <CardHeader>
                <CardTitle className="text-lg">Shipment Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Package className="w-5 h-5 text-logistics-primary" />
                    <div>
                      <p className="font-semibold text-logistics-dark">{shipmentData.cargo}</p>
                      <p className="text-sm text-gray-600">ID: {shipmentData.id}</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Progress</span>
                      <span className="text-sm font-medium">{shipmentData.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-logistics-primary h-3 rounded-full transition-all duration-300"
                        style={{ width: `${shipmentData.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between mt-3 text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span>ETA: {shipmentData.eta}</span>
                      </div>
                      <span className="text-gray-600">{shipmentData.route.distance}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Status</span>
                    <Badge className="status-active">In Transit</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Last Update</span>
                    <span className="text-sm text-gray-500">{shipmentData.lastUpdate}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Driver Information */}
            <Card className="logistics-card">
              <CardHeader>
                <CardTitle className="text-lg">Driver Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-logistics-secondary/10 rounded-full flex items-center justify-center">
                      <Truck className="w-6 h-6 text-logistics-secondary" />
                    </div>
                    <div>
                      <p className="font-semibold text-logistics-dark">{shipmentData.driver.name}</p>
                      <div className="flex items-center gap-1">
                        <div className="flex text-yellow-400">
                          {'★'.repeat(Math.floor(shipmentData.driver.rating))}
                        </div>
                        <span className="text-sm text-gray-600">{shipmentData.driver.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Vehicle</span>
                      <span className="font-medium">{shipmentData.driver.vehicle}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Phone</span>
                      <span className="font-medium">{shipmentData.driver.phone}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" className="flex-1">
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Message
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Updates */}
            <Card className="logistics-card">
              <CardHeader>
                <CardTitle className="text-lg">Recent Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <Navigation className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Location Update</p>
                      <p className="text-xs text-gray-600">Vehicle passing Riverside, CA - On schedule</p>
                      <p className="text-xs text-gray-500">2 minutes ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Pickup Completed</p>
                      <p className="text-xs text-gray-600">Cargo loaded successfully from Los Angeles</p>
                      <p className="text-xs text-gray-500">6 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Traffic Update</p>
                      <p className="text-xs text-gray-600">Minor delays on I-10, ETA adjusted</p>
                      <p className="text-xs text-gray-500">1 hour ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="logistics-card">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Package className="w-4 h-4 mr-2" />
                    Update Delivery Instructions
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Clock className="w-4 h-4 mr-2" />
                    Reschedule Delivery
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Report Issue
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingPage;
