import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface Accessory {
  id: string;
  name: string;
  default_price: number;
  display_order: number;
}

export const AccessoriesManager = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAccessory, setEditingAccessory] = useState<Accessory | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', default_price: 0, display_order: 0 });
  const queryClient = useQueryClient();

  const { data: accessories, isLoading } = useQuery({
    queryKey: ['accessories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('accessories')
        .select('*')
        .order('display_order');
      if (error) throw error;
      return data as Accessory[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Omit<Accessory, 'id'>) => {
      const { error } = await supabase.from('accessories').insert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accessories'] });
      toast.success('Комплектующее создано');
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => toast.error(error.message),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: Accessory) => {
      const { error } = await supabase.from('accessories').update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accessories'] });
      toast.success('Комплектующее обновлено');
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('accessories').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accessories'] });
      toast.success('Комплектующее удалено');
      setDeleteId(null);
    },
    onError: (error: any) => toast.error(error.message),
  });

  const resetForm = () => {
    setFormData({ name: '', default_price: 0, display_order: 0 });
    setEditingAccessory(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAccessory) {
      updateMutation.mutate({ ...formData, id: editingAccessory.id });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (accessory: Accessory) => {
    setEditingAccessory(accessory);
    setFormData({
      name: accessory.name,
      default_price: accessory.default_price,
      display_order: accessory.display_order,
    });
    setIsDialogOpen(true);
  };

  if (isLoading) return <div>Загрузка...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Управление комплектующими</h2>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Добавить комплектующее
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingAccessory ? 'Редактировать комплектующее' : 'Новое комплектующее'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Название</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="default_price">Базовая цена (₽)</Label>
                <Input
                  id="default_price"
                  type="number"
                  value={formData.default_price}
                  onChange={(e) => setFormData({ ...formData, default_price: parseFloat(e.target.value) })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="display_order">Порядок отображения</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                />
              </div>
              <Button type="submit" className="w-full">
                {editingAccessory ? 'Сохранить' : 'Создать'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Название</TableHead>
            <TableHead>Базовая цена</TableHead>
            <TableHead>Порядок</TableHead>
            <TableHead className="text-right">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accessories?.map((accessory) => (
            <TableRow key={accessory.id}>
              <TableCell>{accessory.name}</TableCell>
              <TableCell>{accessory.default_price} ₽</TableCell>
              <TableCell>{accessory.display_order}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" onClick={() => handleEdit(accessory)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setDeleteId(accessory.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Подтвердите удаление</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить это комплектующее? Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && deleteMutation.mutate(deleteId)}>
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
