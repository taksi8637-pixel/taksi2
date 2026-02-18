import { useState, useEffect, useRef } from 'react';
import { 
  Phone, MapPin, Clock, Shield, Star, Car, CreditCard, Headphones, 
  Menu, X, MessageCircle, Plus, Trash2, Send, 
  AlertTriangle, Quote, LogIn, LogOut, Settings, 
  Upload, Camera, Image as ImageIcon, Check, X as XIcon,
  ChevronRight, Sparkles, Zap, Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

// Admin credentials
const ADMIN_USERNAME = 'Admin';
const ADMIN_PASSWORD = 'Admin123';

// Types
type PhoneNumber = {
  id: number;
  number: string;
  label: string;
  formatted: string;
};

// Modern Logo Component
function ModernLogo({ isScrolled }: { isScrolled: boolean }) {
  return (
    <div className="flex items-center gap-3 group cursor-pointer">
      <div className="relative">
        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/30 group-hover:shadow-yellow-500/50 transition-all duration-300 transform group-hover:scale-105">
          <Car className="w-7 h-7 text-black" strokeWidth={2.5} />
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
        </div>
      </div>
      <div className="flex flex-col">
        <span className={`text-2xl font-black tracking-tight transition-colors ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
          DENİZLİ
        </span>
        <span className="text-sm font-bold text-yellow-500 tracking-widest -mt-1">TAKSİ</span>
      </div>
    </div>
  );
}

function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  
  // Phone numbers state (admin only) - Load from localStorage
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>(() => {
    const saved = localStorage.getItem('denizli-taxi-phones');
    if (saved) {
      return JSON.parse(saved);
    }
    // Default phone number
    return [
      { id: 1, number: '+905401490040', label: 'Ana Telefon', formatted: '0540 149 00 40' }
    ];
  });
  const [newPhone, setNewPhone] = useState({ number: '', label: '' });
  const [editingPhone, setEditingPhone] = useState<number | null>(null);
  
  // Gallery images - Load from localStorage
  const [galleryImages, setGalleryImages] = useState<string[]>(() => {
    const saved = localStorage.getItem('denizli-taxi-gallery');
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      '/gallery-1.jpg',
      '/gallery-2.jpg',
      '/gallery-3.jpg',
      '/gallery-4.jpg'
    ];
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  const [testimonials, setTestimonials] = useState([
    { name: 'Ahmet Yılmaz', rating: 5, comment: 'Çok hızlı ve güvenilir hizmet. Şoför çok kibardı.', date: '2 gün önce' },
    { name: 'Ayşe Kaya', rating: 5, comment: 'Gece vakti bile 5 dakikada geldi. Harika!', date: '1 hafta önce' },
    { name: 'Mehmet Demir', rating: 5, comment: 'Fiyatlar uygun, araçlar temiz. Tavsiye ederim.', date: '2 hafta önce' }
  ]);
  const [complaintForm, setComplaintForm] = useState({ name: '', phone: '', complaint: '' });
  const [newTestimonial, setNewTestimonial] = useState({ name: '', rating: 5, comment: '' });
  const [hoverRating, setHoverRating] = useState(0);

  // Save phone numbers to localStorage when changed
  useEffect(() => {
    localStorage.setItem('denizli-taxi-phones', JSON.stringify(phoneNumbers));
  }, [phoneNumbers]);

  // Save gallery images to localStorage when changed
  useEffect(() => {
    localStorage.setItem('denizli-taxi-gallery', JSON.stringify(galleryImages));
  }, [galleryImages]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Get primary phone number
  const primaryPhone = phoneNumbers[0] || { number: '+905551234567', formatted: '0555 123 45 67' };

  const handleCall = (phoneNumber?: string) => {
    const number = phoneNumber || primaryPhone.number;
    window.location.href = `tel:${number}`;
  };

  const handleWhatsApp = (phoneNumber?: string) => {
    const number = phoneNumber || primaryPhone.number;
    window.location.href = `https://wa.me/${number}?text=Merhaba,%20taksi%20hizmeti%20almak%20istiyorum.`;
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  // Admin Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.username === ADMIN_USERNAME && loginForm.password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setShowLoginDialog(false);
      setLoginForm({ username: '', password: '' });
      toast.success('Admin olarak giriş yaptınız!');
    } else {
      toast.error('Kullanıcı adı veya şifre hatalı!');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setShowAdminPanel(false);
    toast.success('Çıkış yapıldı.');
  };

  // Phone Management (Admin Only)
  const addPhoneNumber = () => {
    if (newPhone.number.trim() && newPhone.label.trim()) {
      const formatted = newPhone.number.replace(/\D/g, '').replace(/(\d{4})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4');
      setPhoneNumbers([...phoneNumbers, { 
        id: Date.now(), 
        number: newPhone.number, 
        label: newPhone.label,
        formatted 
      }]);
      setNewPhone({ number: '', label: '' });
      toast.success('Telefon numarası eklendi!');
    }
  };

  const removePhoneNumber = (id: number) => {
    if (phoneNumbers.length > 1) {
      setPhoneNumbers(phoneNumbers.filter(p => p.id !== id));
      toast.success('Telefon numarası silindi!');
    } else {
      toast.error('En az bir telefon numarası kalmalı!');
    }
  };

  const updatePhoneNumber = (id: number, newNumber: string, newLabel: string) => {
    setPhoneNumbers(phoneNumbers.map(p => 
      p.id === id ? { ...p, number: newNumber, label: newLabel, formatted: newNumber.replace(/\D/g, '').replace(/(\d{4})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4') } : p
    ));
    setEditingPhone(null);
    toast.success('Telefon numarası güncellendi!');
  };

  // File Upload Handler
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Dosya boyutu 5MB\'dan küçük olmalı!');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add image from preview
  const addImageFromPreview = () => {
    if (previewImage) {
      setGalleryImages([...galleryImages, previewImage]);
      setPreviewImage(null);
      toast.success('Fotoğraf eklendi!');
    }
  };

  // Gallery Management (Admin Only)
  const removeGalleryImage = (index: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== index));
    toast.success('Fotoğraf silindi!');
  };

  const submitComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Şikayetiniz alındı. En kısa sürede size dönüş yapacağız.');
    setComplaintForm({ name: '', phone: '', complaint: '' });
  };

  const addTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTestimonial.name && newTestimonial.comment) {
      setTestimonials([{ ...newTestimonial, date: 'Bugün' }, ...testimonials]);
      setNewTestimonial({ name: '', rating: 5, comment: '' });
      toast.success('Yorumunuz eklendi!');
    }
  };

  const menuItems = [
    { label: 'Ana Sayfa', id: 'hero' },
    { label: 'Hizmetlerimiz', id: 'services' },
    { label: 'Neden Biz?', id: 'why-us' },
    { label: 'Galeri', id: 'gallery' },
    { label: 'Yorumlar', id: 'testimonials' },
    { label: 'Şikayet', id: 'complaint' },
    { label: 'İletişim', id: 'contact' },
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Navigation - Modern Glassmorphism */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-xl shadow-lg shadow-black/5' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 md:h-24">
            <ModernLogo isScrolled={isScrolled} />
            
            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-8">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`relative text-sm font-semibold transition-all duration-300 hover:text-yellow-500 group ${
                    isScrolled ? 'text-gray-700' : 'text-white'
                  }`}
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-500 transition-all duration-300 group-hover:w-full" />
                </button>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-4">
              {/* Admin Login/Panel Button */}
              {isAdmin ? (
                <Button 
                  onClick={() => setShowAdminPanel(true)}
                  variant="outline"
                  className="border-blue-500 text-blue-600 hover:bg-blue-50 rounded-full px-6"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Admin
                </Button>
              ) : (
                <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline"
                      className={`rounded-full px-6 ${isScrolled ? 'border-gray-300 text-gray-600' : 'border-white/50 text-white hover:bg-white/10'}`}
                    >
                      <LogIn className="w-4 h-4 mr-2" />
                      Giriş
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md rounded-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-center text-2xl font-bold">Admin Girişi</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleLogin} className="space-y-4 mt-4">
                      <Input 
                        placeholder="Kullanıcı adı"
                        value={loginForm.username}
                        onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                        className="rounded-xl"
                      />
                      <Input 
                        type="password"
                        placeholder="Şifre"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                        className="rounded-xl"
                      />
                      <Button type="submit" className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold rounded-xl py-6">
                        <LogIn className="w-5 h-5 mr-2" />
                        Giriş Yap
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              )}

              <Button 
                onClick={() => handleWhatsApp()}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full px-6 shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>
              <Button 
                onClick={() => handleCall()}
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold rounded-full px-6 shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 transition-all"
              >
                <Phone className="w-4 h-4 mr-2" />
                Ara
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-white/10 backdrop-blur"
            >
              {isMobileMenuOpen ? (
                <X className={`w-6 h-6 ${isScrolled ? 'text-gray-900' : 'text-white'}`} />
              ) : (
                <Menu className={`w-6 h-6 ${isScrolled ? 'text-gray-900' : 'text-white'}`} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur-xl shadow-xl rounded-2xl mx-4 mt-2 p-4">
            <div className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left text-gray-700 font-medium py-3 px-4 rounded-xl hover:bg-yellow-50 hover:text-yellow-600 transition-all"
                >
                  {item.label}
                </button>
              ))}
              
              <div className="pt-4 border-t mt-4">
                {isAdmin ? (
                  <Button 
                    onClick={() => setShowAdminPanel(true)}
                    className="w-full bg-blue-500 text-white rounded-xl py-6"
                  >
                    <Settings className="w-5 h-5 mr-2" />
                    Admin Panel
                  </Button>
                ) : (
                  <Button 
                    onClick={() => setShowLoginDialog(true)}
                    className="w-full border-2 border-gray-200 text-gray-600 rounded-xl py-6"
                    variant="outline"
                  >
                    <LogIn className="w-5 h-5 mr-2" />
                    Giriş Yap
                  </Button>
                )}
              </div>
              
              <div className="flex gap-3 pt-2">
                <Button 
                  onClick={() => handleWhatsApp()}
                  className="flex-1 bg-green-500 text-white rounded-xl py-6"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  WhatsApp
                </Button>
                <Button 
                  onClick={() => handleCall()}
                  className="flex-1 bg-yellow-500 text-black font-bold rounded-xl py-6"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Ara
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Admin Panel Dialog */}
      {isAdmin && (
        <Dialog open={showAdminPanel} onOpenChange={setShowAdminPanel}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between text-2xl font-bold">
                <span className="flex items-center gap-2">
                  <Settings className="w-6 h-6 text-yellow-500" />
                  Admin Paneli
                </span>
                <Button onClick={handleLogout} variant="destructive" size="sm" className="rounded-full">
                  <LogOut className="w-4 h-4 mr-2" />
                  Çıkış
                </Button>
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-8 mt-4">
              {/* Phone Numbers Management */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-yellow-500" />
                  Telefon Numaraları Yönetimi
                </h3>
                
                {/* Add New Phone */}
                <div className="flex gap-2 mb-4">
                  <Input 
                    placeholder="Telefon numarası (örn: +905551234567)"
                    value={newPhone.number}
                    onChange={(e) => setNewPhone({...newPhone, number: e.target.value})}
                    className="rounded-xl"
                  />
                  <Input 
                    placeholder="Etiket (örn: Ana Telefon)"
                    value={newPhone.label}
                    onChange={(e) => setNewPhone({...newPhone, label: e.target.value})}
                    className="w-40 rounded-xl"
                  />
                  <Button onClick={addPhoneNumber} className="bg-green-500 text-white rounded-xl px-6">
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>
                
                {/* Phone List */}
                <div className="space-y-2">
                  {phoneNumbers.map((phone) => (
                    <div key={phone.id} className="flex items-center gap-2 bg-white p-3 rounded-xl shadow-sm">
                      {editingPhone === phone.id ? (
                        <>
                          <Input 
                            defaultValue={phone.number}
                            onBlur={(e) => updatePhoneNumber(phone.id, e.target.value, phone.label)}
                            className="flex-1 rounded-xl"
                          />
                          <Input 
                            defaultValue={phone.label}
                            onBlur={(e) => updatePhoneNumber(phone.id, phone.number, e.target.value)}
                            className="w-32 rounded-xl"
                          />
                        </>
                      ) : (
                        <>
                          <span className="flex-1 font-medium">{phone.formatted}</span>
                          <span className="text-gray-500 text-sm">{phone.label}</span>
                          <Button 
                            onClick={() => setEditingPhone(phone.id)}
                            variant="outline"
                            size="sm"
                            className="rounded-lg"
                          >
                            Düzenle
                          </Button>
                          <Button 
                            onClick={() => removePhoneNumber(phone.id)}
                            variant="destructive"
                            size="sm"
                            className="rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Gallery Management with File Upload */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-yellow-500" />
                  Galeri Yönetimi
                </h3>
                
                {/* File Upload Area */}
                <div className="mb-6">
                  <div className="border-2 border-dashed border-yellow-300 rounded-2xl p-8 text-center bg-yellow-50/50 hover:bg-yellow-50 transition-all">
                    <div className="flex justify-center gap-4 mb-4">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all"
                      >
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Upload className="w-6 h-6 text-blue-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">Dosya Yükle</span>
                      </button>
                      
                      <button
                        onClick={() => cameraInputRef.current?.click()}
                        className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all"
                      >
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                          <Camera className="w-6 h-6 text-purple-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">Kamera</span>
                      </button>
                    </div>
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <input
                      ref={cameraInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    
                    <p className="text-sm text-gray-500">veya sürükleyip bırakın (max 5MB)</p>
                  </div>
                  
                  {/* Preview */}
                  {previewImage && (
                    <div className="mt-4 p-4 bg-white rounded-xl shadow-lg">
                      <p className="text-sm font-medium mb-2">Önizleme:</p>
                      <img src={previewImage} alt="Preview" className="w-full h-48 object-cover rounded-lg mb-3" />
                      <div className="flex gap-2">
                        <Button onClick={addImageFromPreview} className="flex-1 bg-green-500 text-white rounded-xl">
                          <Check className="w-4 h-4 mr-2" />
                          Ekle
                        </Button>
                        <Button onClick={() => setPreviewImage(null)} variant="outline" className="rounded-xl">
                          <XIcon className="w-4 h-4 mr-2" />
                          İptal
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Image Grid */}
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {galleryImages.map((image, index) => (
                    <div key={index} className="relative group aspect-square">
                      <img src={image} alt={`Galeri ${index + 1}`} className="w-full h-full object-cover rounded-xl" />
                      <button
                        onClick={() => removeGalleryImage(index)}
                        className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Hero Section - Modern */}
      <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/denizli-taksi-real-1.jpg" 
            alt="Denizli Taksi Filosu" 
            className="w-full h-full object-cover scale-105 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>

        {/* Floating Elements */}
        <div className="absolute top-1/4 right-10 w-64 h-64 bg-yellow-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-10 w-48 h-48 bg-orange-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold mb-6 px-4 py-2 text-sm rounded-full">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                7/24 KESİNTİSİZ HİZMET
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                Denizli'nin En <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Hızlı</span> Taksi Hizmeti
              </h1>
              
              <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-xl">
                Profesyonel şoförlerimiz ve modern araç filomuzla Denizli'nin her noktasına 
                güvenli ve konforlu ulaşım sağlıyoruz.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => handleCall()}
                  size="lg"
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold text-lg px-8 py-7 rounded-2xl shadow-xl shadow-yellow-500/30 hover:shadow-yellow-500/50 transition-all hover:scale-105"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  {primaryPhone.formatted}
                </Button>
                <Button 
                  onClick={() => handleWhatsApp()}
                  size="lg"
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-lg px-8 py-7 rounded-2xl shadow-xl shadow-green-500/30 hover:shadow-green-500/50 transition-all hover:scale-105"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  WhatsApp
                </Button>
              </div>

              {/* Stats */}
              <div className="mt-12 flex items-center gap-8">
                {[
                  { value: '15+', label: 'Yıllık Deneyim' },
                  { value: '50K+', label: 'Mutlu Müşteri' },
                  { value: '7/24', label: 'Kesintisiz Hizmet' },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-4xl font-black text-yellow-400">{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right Side - Feature Cards */}
            <div className="hidden lg:grid grid-cols-2 gap-4">
              {[
                { icon: <Zap className="w-6 h-6" />, title: 'Hızlı Hizmet', desc: '5 dk\'da kapınızda' },
                { icon: <Award className="w-6 h-6" />, title: 'Profesyonel', desc: 'Deneyimli şoförler' },
                { icon: <Shield className="w-6 h-6" />, title: 'Güvenli', desc: 'Sigortalı yolculuk' },
                { icon: <Clock className="w-6 h-6" />, title: '7/24 Açık', desc: 'Kesintisiz hizmet' },
              ].map((item, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 hover:bg-white/20 transition-all">
                  <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center mb-3 text-black">
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-white">{item.title}</h3>
                  <p className="text-sm text-gray-300">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* Services Section - Modern Cards */}
      <section id="services" className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-yellow-100 text-yellow-700 font-bold mb-4 px-4 py-2 rounded-full">HİZMETLERİMİZ</Badge>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Size Özel <span className="text-yellow-500">Taksi</span> Çözümleri
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Her ihtiyacınıza uygun profesyonel ulaşım hizmetleri sunuyoruz
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Clock className="w-8 h-8" />, title: "7/24 Hizmet", desc: "Günün her saati kesintisiz taksi hizmeti", color: "from-blue-400 to-blue-600" },
              { icon: <Car className="w-8 h-8" />, title: "Havalimanı", desc: "Denizli Çardak Havalimanı transferleri", color: "from-purple-400 to-purple-600" },
              { icon: <CreditCard className="w-8 h-8" />, title: "Ödeme", desc: "Nakit ve kredi kartı geçerlidir", color: "from-green-400 to-green-600" },
              { icon: <Shield className="w-8 h-8" />, title: "Güvenli", desc: "Sigortalı ve güvenli taşımacılık", color: "from-orange-400 to-orange-600" }
            ].map((service, index) => (
              <Card key={index} className="group border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${service.color}`} />
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <div className="text-gray-700">{service.icon}</div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-600">{service.desc}</p>
                  <ChevronRight className="w-5 h-5 mx-auto mt-4 text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us Section - Modern */}
      <section id="why-us" className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-3xl blur-2xl opacity-50" />
              <img 
                src="/taxi-interior.jpg" 
                alt="Taksi İçi" 
                className="relative rounded-3xl shadow-2xl w-full transform hover:scale-[1.02] transition-transform duration-500" 
              />
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">100%</p>
                    <p className="text-sm text-gray-500">Memnuniyet</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <Badge className="bg-yellow-100 text-yellow-700 font-bold mb-4 px-4 py-2 rounded-full">NEDEN BİZ?</Badge>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
                Denizli'nin En <span className="text-yellow-500">Güvenilir</span> Taksi Firması
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                15 yılı aşkın deneyimimizle Denizli'de binlerce müşteriye hizmet verdik. 
                Müşteri memnuniyeti bizim için her zaman ön plandadır.
              </p>

              <div className="space-y-4">
                {[
                  { icon: <Star className="w-5 h-5" />, text: "Profesyonel ve deneyimli şoförler" },
                  { icon: <Car className="w-5 h-5" />, text: "Modern ve bakımlı araç filosu" },
                  { icon: <Clock className="w-5 h-5" />, text: "Zamanında ve hızlı hizmet" },
                  { icon: <Headphones className="w-5 h-5" />, text: "7/24 müşteri desteği" },
                  { icon: <Shield className="w-5 h-5" />, text: "Güvenli ve sigortalı yolculuk" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-yellow-50 transition-colors">
                    <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center flex-shrink-0">
                      <div className="text-black">{item.icon}</div>
                    </div>
                    <span className="text-gray-700 font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section - Modern Masonry */}
      <section id="gallery" className="py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="bg-yellow-500 text-black font-bold mb-4 px-4 py-2 rounded-full">GALERİ</Badge>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Fotoğraf <span className="text-yellow-500">Galerisi</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryImages.map((image, index) => (
              <div 
                key={index} 
                className={`relative group overflow-hidden rounded-2xl ${index === 0 || index === 3 ? 'md:col-span-2 md:row-span-2' : ''}`}
              >
                <img 
                  src={image} 
                  alt={`Galeri ${index + 1}`} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - Modern */}
      <section id="testimonials" className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="bg-yellow-100 text-yellow-700 font-bold mb-4 px-4 py-2 rounded-full">MÜŞTERİ YORUMLARI</Badge>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Müşterilerimiz <span className="text-yellow-500">Ne</span> Diyor?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-xl hover:shadow-2xl transition-shadow rounded-2xl overflow-hidden">
                <CardContent className="p-8">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} 
                      />
                    ))}
                  </div>
                  <Quote className="w-10 h-10 text-yellow-400 mb-4" />
                  <p className="text-gray-700 mb-6 text-lg">{testimonial.comment}</p>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className="font-bold text-gray-900">{testimonial.name}</span>
                    <span className="text-sm text-gray-400">{testimonial.date}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Add Testimonial Form */}
          <Card className="max-w-xl mx-auto border-0 shadow-2xl rounded-2xl overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-yellow-400 to-orange-500" />
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Yorumunuzu Ekleyin</h3>
              <form onSubmit={addTestimonial} className="space-y-5">
                <Input 
                  placeholder="Adınız Soyadınız"
                  value={newTestimonial.name}
                  onChange={(e) => setNewTestimonial({...newTestimonial, name: e.target.value})}
                  className="rounded-xl py-6"
                />
                <div className="flex items-center gap-3 justify-center py-2">
                  <span className="text-gray-700 font-medium">Puanınız:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewTestimonial({...newTestimonial, rating: star})}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star 
                          className={`w-8 h-8 transition-all ${
                            star <= (hoverRating || newTestimonial.rating) 
                              ? 'text-yellow-400 fill-yellow-400' 
                              : 'text-gray-200'
                          }`} 
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <Textarea 
                  placeholder="Yorumunuzu yazın..."
                  value={newTestimonial.comment}
                  onChange={(e) => setNewTestimonial({...newTestimonial, comment: e.target.value})}
                  className="rounded-xl min-h-[120px]"
                />
                <Button type="submit" className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold py-6 rounded-xl">
                  <Send className="w-5 h-5 mr-2" />
                  Yorum Gönder
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Complaint Section */}
      <section id="complaint" className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="bg-red-100 text-red-600 font-bold mb-4 px-4 py-2 rounded-full">
              <AlertTriangle className="w-4 h-4 mr-1 inline" />
              ŞİKAYET VE ÖNERİ
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Şikayet ve <span className="text-red-500">Önerileriniz</span>
            </h2>
          </div>

          <Card className="border-0 shadow-2xl rounded-2xl overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-red-400 to-red-600" />
            <CardContent className="p-8">
              <form onSubmit={submitComplaint} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Adınız Soyadınız</label>
                    <Input 
                      placeholder="Ad Soyad"
                      value={complaintForm.name}
                      onChange={(e) => setComplaintForm({...complaintForm, name: e.target.value})}
                      required
                      className="rounded-xl py-6"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Telefon Numaranız</label>
                    <Input 
                      placeholder="05XX XXX XX XX"
                      value={complaintForm.phone}
                      onChange={(e) => setComplaintForm({...complaintForm, phone: e.target.value})}
                      required
                      className="rounded-xl py-6"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Şikayet/Öneri</label>
                  <Textarea 
                    placeholder="Şikayet veya önerinizi detaylı bir şekilde yazın..."
                    rows={5}
                    value={complaintForm.complaint}
                    onChange={(e) => setComplaintForm({...complaintForm, complaint: e.target.value})}
                    required
                    className="rounded-xl"
                  />
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white font-bold py-7 rounded-xl">
                  <Send className="w-5 h-5 mr-2" />
                  Gönder
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Section - Modern */}
      <section id="contact" className="py-24 bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-black mb-4">
              Hemen Taksi <span className="text-white">Çağırın!</span>
            </h2>
            <p className="text-black/70 max-w-2xl mx-auto text-lg">
              Tek bir telefonla kapınıza kadar geliyoruz. Hemen arayın!
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Phone Cards */}
            {phoneNumbers.map((phone) => (
              <Card key={phone.id} className="bg-white border-0 shadow-2xl rounded-2xl overflow-hidden hover:shadow-3xl transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Phone className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{phone.label}</h3>
                  <p className="text-gray-500 text-sm mb-4">7/24 ulaşabilirsiniz</p>
                  <p className="text-2xl font-black text-gray-900 mb-4">{phone.formatted}</p>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleCall(phone.number)}
                      className="flex-1 bg-yellow-500 text-black font-bold rounded-xl"
                    >
                      <Phone className="w-4 h-4 mr-1" />
                      Ara
                    </Button>
                    <Button 
                      onClick={() => handleWhatsApp(phone.number)}
                      className="flex-1 bg-green-500 text-white rounded-xl"
                    >
                      <MessageCircle className="w-4 h-4 mr-1" />
                      WP
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card className="bg-white border-0 shadow-2xl rounded-2xl overflow-hidden">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Adres</h3>
                <p className="text-gray-500 text-sm mb-4">Merkez ofisimiz</p>
                <p className="text-lg font-bold text-gray-900">
                  Saraylar Mahallesi<br />Pamukkale/Denizli
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-2xl rounded-2xl overflow-hidden">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Çalışma Saatleri</h3>
                <p className="text-gray-500 text-sm mb-4">Her zaman hizmetinizdeyiz</p>
                <p className="text-lg font-bold text-gray-900">
                  7 Gün / 24 Saat<br /><span className="text-green-500">Açık</span>
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => handleCall()} size="lg" className="bg-black hover:bg-gray-800 text-white font-bold text-xl px-12 py-8 rounded-2xl shadow-2xl">
              <Phone className="w-6 h-6 mr-3" />
              ŞİMDİ ARA
            </Button>
            <Button onClick={() => handleWhatsApp()} size="lg" className="bg-white text-green-600 hover:bg-gray-100 font-bold text-xl px-12 py-8 rounded-2xl shadow-2xl">
              <MessageCircle className="w-6 h-6 mr-3" />
              WHATSAPP
            </Button>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="h-96 bg-gray-200">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12603.6!2d29.086!3d37.774!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14c73f1c8e7b5c5d%3A0x5c5d5c5d5c5d5c5d!2sDenizli!5e0!3m2!1str!2str!4v1234567890"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Denizli Taksi Konum"
        />
      </section>

      {/* Footer - Modern */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center">
                  <Car className="w-7 h-7 text-black" />
                </div>
                <div>
                  <span className="text-2xl font-black">DENİZLİ</span>
                  <span className="text-yellow-500 font-bold block -mt-1">TAKSİ</span>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Denizli'nin en hızlı ve güvenilir taksi hizmeti. 
                7/24 kesintisiz hizmetinizdeyiz.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6 text-yellow-400">Hızlı Linkler</h4>
              <ul className="space-y-3">
                {menuItems.map((item) => (
                  <li key={item.id}>
                    <button onClick={() => scrollToSection(item.id)} className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                      <ChevronRight className="w-4 h-4" />
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6 text-yellow-400">Hizmetlerimiz</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4" /> Şehir İçi Ulaşım</li>
                <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4" /> Havalimanı Transferi</li>
                <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4" /> Özel Şoför Hizmeti</li>
                <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4" /> Kurumsal Taşımacılık</li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6 text-yellow-400">İletişim</h4>
              <ul className="space-y-3 text-gray-400">
                {phoneNumbers.map((phone) => (
                  <li key={phone.id} className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-yellow-500" />
                    {phone.formatted}
                  </li>
                ))}
                <li className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-green-500" />
                  WhatsApp
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-500" />
                  Pamukkale/Denizli
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-500">
              © 2024 Denizli Taksi. Tüm hakları saklıdır.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
