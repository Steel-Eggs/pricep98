import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CategoriesManager } from '@/components/admin/CategoriesManager';
import { ProductsManager } from '@/components/admin/ProductsManager';
import { AccessoriesManager } from '@/components/admin/AccessoriesManager';
import { LogOut, Package, Tags, Wrench } from 'lucide-react';
import logoMono from '@/assets/logo-mono.png';
import { toast } from 'sonner';

const AdminPage = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');

  const handleSignOut = async () => {
    await signOut();
    toast.success('Выход выполнен');
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={logoMono} alt="ПРИЦЕП98" className="h-8" />
              <h1 className="text-xl font-bold">Административная панель</h1>
            </div>
            <Button onClick={handleSignOut} variant="outline">
              <LogOut className="w-4 h-4 mr-2" />
              Выйти
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <Tags className="w-4 h-4" />
              Категории
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Прицепы
            </TabsTrigger>
            <TabsTrigger value="accessories" className="flex items-center gap-2">
              <Wrench className="w-4 h-4" />
              Комплектующие
            </TabsTrigger>
          </TabsList>

          <TabsContent value="categories">
            <CategoriesManager />
          </TabsContent>

          <TabsContent value="products">
            <ProductsManager />
          </TabsContent>

          <TabsContent value="accessories">
            <AccessoriesManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

const Admin = () => {
  return (
    <ProtectedRoute>
      <AdminPage />
    </ProtectedRoute>
  );
};

export default Admin;
